export type Complexity = "Low" | "Medium" | "High";

export type WorkflowFormData = {
  businessType: string;
  processName: string;
  processDescription: string;
  toolsUsed: string;
  painPoint: string;
  frequencyPerWeek: number;
  minutesPerTask: number;
};

export type EstimatedTimeSavings = {
  minutesSavedPerTask: number;
  hoursSavedPerWeek: number;
  hoursSavedPerMonth: number;
};

export type BlueprintStep = {
  name: string;
  action: string;
  tool?: string;
  notes?: string;
};

export type WorkflowResult = {
  summary: string;
  automationOpportunity: string;
  recommendedTools: string[];
  workflowSteps: string[];
  estimatedTimeSavings: EstimatedTimeSavings;
  complexity: Complexity;
  implementationPlan: string[];
  risks: string[];
  clientFriendlyExplanation: string;
  n8nStyleBlueprint: {
    trigger: string;
    steps: BlueprintStep[];
  };
};

export type WorkflowRecord = {
  id: string;
  createdAt: string;
  input: WorkflowFormData;
  result: WorkflowResult;
};

export type GenerateWorkflowResponse = {
  workflow?: WorkflowResult;
  error?: string;
};
