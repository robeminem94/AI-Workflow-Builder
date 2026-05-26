import type { BlueprintStep, Complexity, WorkflowFormData, WorkflowResult } from "@/types/workflow";

export function normalizeWorkflowResult(raw: unknown, input: WorkflowFormData): WorkflowResult {
  const value = asRecord(raw);
  const minutesSpent = Math.max(1, input.minutesPerTask);
  const frequency = Math.max(1, input.frequencyPerWeek);
  const realisticDefault = Math.max(1, Math.round(minutesSpent * 0.55));
  const maxRealisticSavings = Math.max(1, Math.round(minutesSpent * 0.9));
  const minutesSavedPerTask = clampNumber(
    toNumber(asRecord(value.estimatedTimeSavings).minutesSavedPerTask, realisticDefault),
    1,
    maxRealisticSavings
  );

  const hoursSavedPerWeek = roundToOneDecimal((minutesSavedPerTask * frequency) / 60);
  const hoursSavedPerMonth = roundToOneDecimal(hoursSavedPerWeek * 4.33);

  return {
    summary: toStringValue(value.summary, fallbackSummary(input)),
    automationOpportunity: toStringValue(
      value.automationOpportunity,
      `This process has clear automation potential because it repeats ${frequency} times per week and involves manual coordination between tools.`
    ),
    recommendedTools: toStringArray(value.recommendedTools, defaultTools(input.toolsUsed)),
    workflowSteps: toStringArray(value.workflowSteps, [
      "Capture the process trigger from the current source system.",
      "Validate and structure the submitted information.",
      "Update the destination tool and notify the relevant person."
    ]),
    estimatedTimeSavings: {
      minutesSavedPerTask,
      hoursSavedPerWeek,
      hoursSavedPerMonth
    },
    complexity: toComplexity(value.complexity),
    implementationPlan: toStringArray(value.implementationPlan, [
      "Document the current process and confirm required data fields.",
      "Build a small proof of concept for the highest-volume step.",
      "Test with a small sample before rolling out to the team."
    ]),
    risks: toStringArray(value.risks, [
      "Incorrect or incomplete input data could still require manual review.",
      "Tool permissions and data access should be reviewed before implementation."
    ]),
    clientFriendlyExplanation: toStringValue(
      value.clientFriendlyExplanation,
      `This automation would reduce manual admin work for ${input.processName} while keeping the team in control of exceptions and approvals.`
    ),
    n8nStyleBlueprint: normalizeBlueprint(value.n8nStyleBlueprint, input)
  };
}

function normalizeBlueprint(rawBlueprint: unknown, input: WorkflowFormData) {
  const blueprint = asRecord(rawBlueprint);
  return {
    trigger: toStringValue(blueprint.trigger, `New ${input.processName.toLowerCase()} request received`),
    steps: toBlueprintSteps(blueprint.steps)
  };
}

function toBlueprintSteps(value: unknown): BlueprintStep[] {
  if (!Array.isArray(value)) {
    return [
      { name: "Capture request", action: "Receive the initial process data", tool: "Current form or inbox" },
      { name: "Update system", action: "Create or update the relevant record", tool: "CRM or spreadsheet" },
      { name: "Notify team", action: "Send confirmation and create a follow-up task", tool: "Email or task tool" }
    ];
  }

  return value.slice(0, 8).map((step, index) => {
    if (typeof step === "string") {
      return {
        name: `Step ${index + 1}`,
        action: step
      };
    }

    const record = asRecord(step);
    return {
      name: toStringValue(record.name, `Step ${index + 1}`),
      action: toStringValue(record.action, "Perform the workflow action"),
      tool: optionalString(record.tool),
      notes: optionalString(record.notes)
    };
  });
}

function fallbackSummary(input: WorkflowFormData) {
  return `${input.processName} can likely be improved by automating repeated handoffs, data entry, and follow-up communication.`;
}

function defaultTools(toolsUsed: string) {
  const tools = toolsUsed
    .split(",")
    .map((tool) => tool.trim())
    .filter(Boolean);

  return tools.length > 0 ? ["n8n or Zapier", ...tools] : ["n8n or Zapier", "Email", "Spreadsheet or CRM"];
}

function toComplexity(value: unknown): Complexity {
  return value === "Low" || value === "Medium" || value === "High" ? value : "Medium";
}

function toStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value.map((item) => String(item).trim()).filter(Boolean);
  return items.length > 0 ? items : fallback;
}

function toStringValue(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function toNumber(value: unknown, fallback: number) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(Math.round(value), min), max);
}

function roundToOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}
