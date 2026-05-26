"use client";

import { useState, useSyncExternalStore } from "react";
import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { Card } from "@/components/card";
import { WorkflowResultView } from "@/components/workflow-result-view";
import {
  getLatestWorkflowSnapshot,
  getSavedWorkflowsSnapshot,
  parseSavedWorkflowsSnapshot,
  parseWorkflowRecordSnapshot,
  subscribeToWorkflowStorage
} from "@/lib/workflow-records";

export default function ResultsPage() {
  const workflowSnapshot = useSyncExternalStore(subscribeToWorkflowStorage, getWorkflowSnapshotFromCurrentUrl, () => "");
  const record = getWorkflowFromSnapshot(workflowSnapshot);
  const [savedMessage, setSavedMessage] = useState("");

  function handleSaved() {
    setSavedMessage("Workflow saved locally in this browser.");
    window.setTimeout(() => setSavedMessage(""), 2200);
  }

  if (!record) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
        <Card className="text-center">
          <h1 className="text-3xl font-bold text-ink">No workflow result found</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600">
            Generate a workflow first or open a saved workflow from the saved page.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/builder">Build a Workflow</ButtonLink>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      {savedMessage ? (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          <CheckCircle2 className="h-5 w-5" />
          {savedMessage}
        </div>
      ) : null}
      <WorkflowResultView record={record} onSaved={handleSaved} />
    </main>
  );
}

function getWorkflowSnapshotFromCurrentUrl() {
  if (typeof window === "undefined") {
    return "";
  }

  const params = new URLSearchParams(window.location.search);
  const savedId = params.get("id");
  return savedId ? `saved:${savedId}:${getSavedWorkflowsSnapshot()}` : `latest:${getLatestWorkflowSnapshot()}`;
}

function getWorkflowFromSnapshot(snapshot: string) {
  if (snapshot.startsWith("saved:")) {
    const savedSnapshot = snapshot.slice("saved:".length);
    const separatorIndex = savedSnapshot.indexOf(":");

    if (separatorIndex === -1) {
      return null;
    }

    const savedId = savedSnapshot.slice(0, separatorIndex);
    const savedWorkflowsSnapshot = savedSnapshot.slice(separatorIndex + 1);
    return parseSavedWorkflowsSnapshot(savedWorkflowsSnapshot).find((workflow) => workflow.id === savedId) ?? null;
  }

  return parseWorkflowRecordSnapshot(snapshot.replace(/^latest:/, ""));
}
