"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button, ButtonLink } from "@/components/button";
import { Card } from "@/components/card";
import { SectionHeading } from "@/components/section-heading";
import {
  deleteWorkflow,
  formatDate,
  getSavedWorkflowsSnapshot,
  parseSavedWorkflowsSnapshot,
  subscribeToWorkflowStorage
} from "@/lib/workflow-records";

export default function SavedPage() {
  const workflowsSnapshot = useSyncExternalStore(subscribeToWorkflowStorage, getSavedWorkflowsSnapshot, () => "[]");
  const workflows = parseSavedWorkflowsSnapshot(workflowsSnapshot);

  function handleDelete(id: string) {
    deleteWorkflow(id);
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Saved workflows"
          title="Local workflow library"
          description="Saved workflows are stored in your browser local storage for this portfolio version."
        />
        <ButtonLink href="/builder">Build a Workflow</ButtonLink>
      </div>

      {workflows.length === 0 ? (
        <Card className="mt-10 text-center">
          <h2 className="text-2xl font-semibold text-ink">No saved workflows yet</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Generate a workflow plan, review the result, and click save to keep it here.
          </p>
          <div className="mt-7 flex justify-center">
            <ButtonLink href="/builder">Create your first workflow</ButtonLink>
          </div>
        </Card>
      ) : (
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {workflows.map((workflow) => (
            <Card key={workflow.id} className="transition hover:-translate-y-1 hover:shadow-soft">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-brand-600">{workflow.input.businessType}</p>
                  <h2 className="mt-2 text-2xl font-bold text-ink">{workflow.input.processName}</h2>
                  <p className="mt-3 text-sm text-slate-500">Created {formatDate(workflow.createdAt)}</p>
                </div>
                <span className="rounded-full border border-line bg-cloud px-3 py-1 text-sm font-semibold text-slate-700">
                  {workflow.result.complexity}
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-line bg-cloud p-4">
                  <p className="text-sm text-slate-500">Hours saved per week</p>
                  <p className="mt-2 text-3xl font-bold text-ink">
                    {workflow.result.estimatedTimeSavings.hoursSavedPerWeek}h
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-cloud p-4">
                  <p className="text-sm text-slate-500">Tools recommended</p>
                  <p className="mt-2 text-3xl font-bold text-ink">{workflow.result.recommendedTools.length}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/results?id=${workflow.id}`}
                  className="focus-ring inline-flex items-center justify-center rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
                >
                  Open details
                </Link>
                <Button variant="danger" onClick={() => handleDelete(workflow.id)}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
