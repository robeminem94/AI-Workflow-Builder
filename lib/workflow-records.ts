import type { WorkflowFormData, WorkflowRecord, WorkflowResult } from "@/types/workflow";

export const LATEST_WORKFLOW_KEY = "ai-workflow-builder:latest";
export const SAVED_WORKFLOWS_KEY = "ai-workflow-builder:saved";

export function createWorkflowRecord(input: WorkflowFormData, result: WorkflowResult): WorkflowRecord {
  return {
    id: createId(),
    createdAt: new Date().toISOString(),
    input,
    result
  };
}

export function getLatestWorkflow(): WorkflowRecord | null {
  return parseWorkflowRecordSnapshot(getLatestWorkflowSnapshot());
}

export function setLatestWorkflow(record: WorkflowRecord) {
  window.localStorage.setItem(LATEST_WORKFLOW_KEY, JSON.stringify(record));
  notifyWorkflowStorageChanged();
}

export function getSavedWorkflows(): WorkflowRecord[] {
  return parseSavedWorkflowsSnapshot(getSavedWorkflowsSnapshot());
}

export function getSavedWorkflow(id: string): WorkflowRecord | null {
  return getSavedWorkflows().find((workflow) => workflow.id === id) ?? null;
}

export function saveWorkflow(record: WorkflowRecord) {
  const workflows = getSavedWorkflows();
  const existingIndex = workflows.findIndex((workflow) => workflow.id === record.id);
  const nextWorkflows = existingIndex >= 0 ? [...workflows] : [record, ...workflows];

  if (existingIndex >= 0) {
    nextWorkflows[existingIndex] = record;
  }

  window.localStorage.setItem(SAVED_WORKFLOWS_KEY, JSON.stringify(nextWorkflows));
  notifyWorkflowStorageChanged();
}

export function deleteWorkflow(id: string) {
  const nextWorkflows = getSavedWorkflows().filter((workflow) => workflow.id !== id);
  window.localStorage.setItem(SAVED_WORKFLOWS_KEY, JSON.stringify(nextWorkflows));
  notifyWorkflowStorageChanged();
}

export function subscribeToWorkflowStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("ai-workflow-builder-storage", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("ai-workflow-builder-storage", callback);
  };
}

export function getLatestWorkflowSnapshot() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(LATEST_WORKFLOW_KEY) ?? "";
}

export function getSavedWorkflowsSnapshot() {
  if (typeof window === "undefined") {
    return "[]";
  }

  return window.localStorage.getItem(SAVED_WORKFLOWS_KEY) ?? "[]";
}

export function parseWorkflowRecordSnapshot(snapshot: string): WorkflowRecord | null {
  return parseJson<WorkflowRecord | null>(snapshot, null);
}

export function parseSavedWorkflowsSnapshot(snapshot: string): WorkflowRecord[] {
  return parseJson<WorkflowRecord[]>(snapshot, []);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `workflow-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function parseJson<T>(snapshot: string, fallback: T): T {
  try {
    return snapshot ? (JSON.parse(snapshot) as T) : fallback;
  } catch {
    return fallback;
  }
}

function notifyWorkflowStorageChanged() {
  window.dispatchEvent(new Event("ai-workflow-builder-storage"));
}
