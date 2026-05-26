"use client";

import Link from "next/link";
import { CheckCircle2, Clock, Database, Save, ShieldAlert } from "lucide-react";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { CopyButton } from "@/components/copy-button";
import { saveWorkflow } from "@/lib/workflow-records";
import type { WorkflowRecord } from "@/types/workflow";

export function WorkflowResultView({ record, onSaved }: { record: WorkflowRecord; onSaved?: () => void }) {
  const { input, result } = record;
  const clientSummary = `${result.clientFriendlyExplanation}\n\nEstimated time savings: ${result.estimatedTimeSavings.hoursSavedPerWeek} hours per week.\nComplexity: ${result.complexity}.`;

  function handleSave() {
    saveWorkflow(record);
    onSaved?.();
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden p-0">
        <div className="border-b border-line bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand-600">Workflow plan</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{input.processName}</h1>
              <p className="mt-3 text-base text-slate-600">{input.businessType}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-wrap lg:justify-end">
              <CopyButton label="Copy client summary" value={clientSummary} />
              <CopyButton label="Copy workflow JSON" value={JSON.stringify(result, null, 2)} />
              <Button onClick={handleSave}>
                <Save className="h-4 w-4" />
                Save workflow
              </Button>
              <Link
                href="/builder"
                className="focus-ring inline-flex items-center justify-center rounded-2xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-sm transition hover:bg-brand-50"
              >
                Start new workflow
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-4 bg-cloud p-6 sm:grid-cols-3 sm:p-8">
          <Metric
            icon={<Clock className="h-5 w-5" />}
            label="Saved per task"
            value={`${result.estimatedTimeSavings.minutesSavedPerTask} min`}
          />
          <Metric
            icon={<Clock className="h-5 w-5" />}
            label="Saved per week"
            value={`${result.estimatedTimeSavings.hoursSavedPerWeek}h`}
          />
          <Metric label="Complexity" value={result.complexity} icon={<Database className="h-5 w-5" />} />
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <ResultCard title="Summary">{result.summary}</ResultCard>
        <ResultCard title="Automation opportunity">{result.automationOpportunity}</ResultCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <h2 className="text-xl font-semibold text-ink">Recommended tools</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {result.recommendedTools.map((tool) => (
              <span key={tool} className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
                {tool}
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-ink">Estimated time savings</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <SmallStat label="Per task" value={`${result.estimatedTimeSavings.minutesSavedPerTask} min`} />
            <SmallStat label="Per week" value={`${result.estimatedTimeSavings.hoursSavedPerWeek}h`} />
            <SmallStat label="Per month" value={`${result.estimatedTimeSavings.hoursSavedPerMonth}h`} />
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ListCard title="Workflow steps" items={result.workflowSteps} icon="check" />
        <ListCard title="Implementation plan" items={result.implementationPlan} icon="check" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <ListCard title="Risks and considerations" items={result.risks} icon="risk" />
        <ResultCard title="Client-friendly explanation">{result.clientFriendlyExplanation}</ResultCard>
      </div>

      <Card>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ink">n8n-style blueprint</h2>
            <p className="mt-2 text-sm text-slate-600">
              Conceptual structure only. This is not a working n8n export.
            </p>
          </div>
          <CopyButton label="Copy blueprint" value={JSON.stringify(result.n8nStyleBlueprint, null, 2)} />
        </div>
        <pre className="mt-5 overflow-x-auto rounded-2xl bg-ink p-5 text-sm leading-6 text-slate-100">
          <code>{JSON.stringify(result.n8nStyleBlueprint, null, 2)}</code>
        </pre>
      </Card>
    </div>
  );
}

function Metric({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3 text-brand-600">
        {icon}
        <p className="text-sm font-medium text-slate-500">{label}</p>
      </div>
      <p className="mt-3 text-3xl font-bold text-ink">{value}</p>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-cloud p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
    </div>
  );
}

function ResultCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-slate-700">{children}</p>
    </Card>
  );
}

function ListCard({ title, items, icon }: { title: string; items: string[]; icon: "check" | "risk" }) {
  return (
    <Card>
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <ul className="mt-5 space-y-4">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
            {icon === "check" ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-500" />
            ) : (
              <ShieldAlert className="mt-0.5 h-5 w-5 flex-none text-amber-500" />
            )}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
