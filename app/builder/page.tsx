"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, WandSparkles } from "lucide-react";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { SectionHeading } from "@/components/section-heading";
import { createWorkflowRecord, setLatestWorkflow } from "@/lib/workflow-records";
import { hasValidationErrors, validateWorkflowInput } from "@/lib/workflow-validation";
import type { GenerateWorkflowResponse, WorkflowFormData } from "@/types/workflow";

const emptyForm: WorkflowFormData = {
  businessType: "",
  processName: "",
  processDescription: "",
  toolsUsed: "",
  painPoint: "",
  frequencyPerWeek: 1,
  minutesPerTask: 5
};

const sampleForm: WorkflowFormData = {
  businessType: "Dental clinic",
  processName: "New patient intake",
  processDescription:
    "Patients fill in a contact form. Someone manually checks the email, copies the details into the CRM, sends a confirmation email and creates a reminder task.",
  toolsUsed: "Gmail, Google Sheets, CRM",
  painPoint: "Too much manual copying and sometimes mistakes happen.",
  frequencyPerWeek: 30,
  minutesPerTask: 8
};

export default function BuilderPage() {
  const router = useRouter();
  const [form, setForm] = useState<WorkflowFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof WorkflowFormData, string>>>({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function updateField<K extends keyof WorkflowFormData>(field: K, value: WorkflowFormData[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setApiError("");

    const validationErrors = validateWorkflowInput(form);
    setErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = (await response.json()) as GenerateWorkflowResponse;

      if (!response.ok || !data.workflow) {
        throw new Error(data.error ?? "Unable to generate workflow. Please try again.");
      }

      const record = createWorkflowRecord(form, data.workflow);
      setLatestWorkflow(record);
      router.push("/results");
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="Workflow input"
            title="Describe a process the way a client would"
            description="The form captures enough context for the AI to produce realistic automation ideas, time savings, and implementation steps."
          />
          <Card className="mt-8 bg-ink text-white">
            <h2 className="text-xl font-semibold">Good inputs create better plans</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Mention who starts the process, where data is copied, which tools are involved, and where mistakes or delays happen.
            </p>
            <Button className="mt-6 bg-white text-ink hover:bg-slate-100" onClick={() => setForm(sampleForm)}>
              Use sample input
            </Button>
          </Card>
        </div>

        <Card>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Business type" error={errors.businessType}>
                <input
                  className="input-field"
                  value={form.businessType}
                  onChange={(event) => updateField("businessType", event.target.value)}
                  placeholder="Dental clinic"
                />
              </Field>
              <Field label="Process name" error={errors.processName}>
                <input
                  className="input-field"
                  value={form.processName}
                  onChange={(event) => updateField("processName", event.target.value)}
                  placeholder="New patient intake"
                />
              </Field>
            </div>

            <Field label="Current process description" error={errors.processDescription}>
              <textarea
                className="input-field min-h-36 resize-y"
                value={form.processDescription}
                onChange={(event) => updateField("processDescription", event.target.value)}
                placeholder="Describe what happens today, step by step."
              />
            </Field>

            <Field label="Tools currently used" error={errors.toolsUsed}>
              <input
                className="input-field"
                value={form.toolsUsed}
                onChange={(event) => updateField("toolsUsed", event.target.value)}
                placeholder="Gmail, Excel, HubSpot, Slack, Notion"
              />
            </Field>

            <Field label="Main pain point" error={errors.painPoint}>
              <textarea
                className="input-field min-h-28 resize-y"
                value={form.painPoint}
                onChange={(event) => updateField("painPoint", event.target.value)}
                placeholder="What feels slow, repetitive, error-prone, or hard to track?"
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Times per week" error={errors.frequencyPerWeek}>
                <input
                  className="input-field"
                  type="number"
                  min={1}
                  value={form.frequencyPerWeek}
                  onChange={(event) => updateField("frequencyPerWeek", Number(event.target.value))}
                />
              </Field>
              <Field label="Minutes per task" error={errors.minutesPerTask}>
                <input
                  className="input-field"
                  type="number"
                  min={1}
                  value={form.minutesPerTask}
                  onChange={(event) => updateField("minutesPerTask", Number(event.target.value))}
                />
              </Field>
            </div>

            {apiError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {apiError}
              </div>
            ) : null}

            <Button type="submit" size="lg" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <WandSparkles className="h-5 w-5" />}
              {isLoading ? "Building workflow..." : "Generate Workflow Plan"}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-sm text-red-600">{error}</span> : null}
    </label>
  );
}
