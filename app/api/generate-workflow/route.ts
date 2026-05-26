import { NextResponse } from "next/server";
import { normalizeWorkflowResult } from "@/lib/workflow-normalizer";
import { hasValidationErrors, validateWorkflowInput } from "@/lib/workflow-validation";
import type { WorkflowFormData } from "@/types/workflow";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const requestCounts = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  const rateLimitKey = getRateLimitKey(request);

  if (!checkRateLimit(rateLimitKey)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a while before generating another workflow." },
      { status: 429 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing OPENAI_API_KEY. Add it to .env.local and restart the dev server." },
      { status: 500 }
    );
  }

  let input: WorkflowFormData;

  try {
    input = (await request.json()) as WorkflowFormData;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validationErrors = validateWorkflowInput(input);

  if (hasValidationErrors(validationErrors)) {
    return NextResponse.json({ error: "Please complete all required workflow fields." }, { status: 400 });
  }

  try {
    const aiResult = await generateWorkflowWithOpenAI(input, apiKey);
    const workflow = normalizeWorkflowResult(aiResult, input);

    return NextResponse.json({ workflow });
  } catch (error) {
    console.error("OpenAI workflow generation failed", error);
    return NextResponse.json(
      { error: "The AI service could not generate a workflow right now. Please try again." },
      { status: 502 }
    );
  }
}

async function generateWorkflowWithOpenAI(input: WorkflowFormData, apiKey: string) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.25,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a practical AI automation consultant for small businesses. Return only valid JSON. Be realistic, business-friendly, and do not overpromise. Do not claim that any workflow has been built or deployed."
        },
        {
          role: "user",
          content: buildPrompt(input)
        }
      ]
    })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${details}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI response did not include content.");
  }

  try {
    return JSON.parse(content) as unknown;
  } catch {
    throw new Error("OpenAI response was not valid JSON.");
  }
}

function buildPrompt(input: WorkflowFormData) {
  return `Analyze this business process and return a realistic automation plan as JSON.

Input:
- Business type: ${input.businessType}
- Process name: ${input.processName}
- Current process description: ${input.processDescription}
- Tools currently used: ${input.toolsUsed}
- Main pain point: ${input.painPoint}
- Approximate number of times this process happens per week: ${input.frequencyPerWeek}
- Average minutes spent per task: ${input.minutesPerTask}

Rules:
- Time savings must be based on frequency per week and minutes per task.
- minutesSavedPerTask should be less than the current minutes per task and realistic for partial automation.
- Keep language clear, professional, and easy for a non-technical business owner to understand.
- The n8nStyleBlueprint must be conceptual only, not a real export.
- Include practical risks and checks.
- Recommended tools can include existing tools if relevant plus automation platforms like n8n, Zapier, Make, or native integrations.

Return exactly this JSON shape:
{
  "summary": "",
  "automationOpportunity": "",
  "recommendedTools": [],
  "workflowSteps": [],
  "estimatedTimeSavings": {
    "minutesSavedPerTask": 0,
    "hoursSavedPerWeek": 0,
    "hoursSavedPerMonth": 0
  },
  "complexity": "Low | Medium | High",
  "implementationPlan": [],
  "risks": [],
  "clientFriendlyExplanation": "",
  "n8nStyleBlueprint": {
    "trigger": "",
    "steps": [
      {
        "name": "",
        "action": "",
        "tool": "",
        "notes": ""
      }
    ]
  }
}`;
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const current = requestCounts.get(key);

  if (!current || current.resetAt <= now) {
    requestCounts.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  current.count += 1;
  requestCounts.set(key, current);
  return true;
}

function getRateLimitKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || request.headers.get("x-real-ip") || "local-development";
}
