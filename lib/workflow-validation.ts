import type { WorkflowFormData } from "@/types/workflow";

export function validateWorkflowInput(input: Partial<WorkflowFormData>) {
  const errors: Partial<Record<keyof WorkflowFormData, string>> = {};

  if (!input.businessType?.trim()) errors.businessType = "Business type is required.";
  if (!input.processName?.trim()) errors.processName = "Process name is required.";
  if (!input.processDescription?.trim()) errors.processDescription = "Current process description is required.";
  if (!input.toolsUsed?.trim()) errors.toolsUsed = "Current tools are required.";
  if (!input.painPoint?.trim()) errors.painPoint = "Main pain point is required.";
  if (!Number.isFinite(Number(input.frequencyPerWeek)) || Number(input.frequencyPerWeek) <= 0) {
    errors.frequencyPerWeek = "Frequency must be greater than 0.";
  }
  if (!Number.isFinite(Number(input.minutesPerTask)) || Number(input.minutesPerTask) <= 0) {
    errors.minutesPerTask = "Minutes per task must be greater than 0.";
  }

  return errors;
}

export function hasValidationErrors(errors: Partial<Record<keyof WorkflowFormData, string>>) {
  return Object.values(errors).some(Boolean);
}
