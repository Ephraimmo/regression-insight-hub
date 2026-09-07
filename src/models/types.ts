export type RunStatus = "passed" | "failed" | "blocked" | "unknown";

export interface Environment {
  id: string;
  name: string;
  version: string;
  release: string;
}

export interface Feature {
  id: string;
  name: string;
  breakdownName: string;
  scenarios: string[];
  team?: string;
  owner?: string;
}

export interface RegressionRun {
  id: string;
  environmentId: string;
  version: string;
  startedAt: string;
  /** seconds, null when the source data does not contain the metric */
  loginTime: number | null;
  ajaxLoad: number | null;
  pageLoad: number | null;
}

export interface ExecutionStep {
  keyword: string;
  name: string;
  status: RunStatus;
  duration: number;
}

export interface Failure {
  message: string;
  browserError?: string;
  lastSuccessfulStep?: string;
  failedStep?: string;
}

export interface ScenarioExecution {
  id: string;
  runId: string;
  environmentId: string;
  featureId: string;
  featureName: string;
  breakdownName: string;
  scenarioName: string;
  scenarioId: string;
  status: RunStatus;
  /** seconds */
  duration: number;
  timestamp: string;
  workerId: string;
  actuallyExecuted: boolean;
  steps: ExecutionStep[];
  failure?: Failure;
}

export interface Task {
  id: string;
  title: string;
  featureId?: string;
  environmentId?: string;
  status: "open" | "resolved";
  team?: string;
  createdAt: string;
}

export interface XmlHelperDocument {
  id: string;
  title: string;
  featureId?: string;
  tags: string[];
  updatedAt: string;
  body: string;
}

export interface DataSource {
  id: string;
  name: string;
  type: "Demo" | "Excel" | "JSON" | "CSV" | "XML";
  status: "connected" | "available" | "not_connected";
  records: number | null;
  uploadedAt: string | null;
  detail: string;
}

export interface MetricDefinition {
  id: MetricId;
  label: string;
  unit: string;
  /** true when at least one record in the dataset carries the metric */
  available: boolean;
  lowerIsBetter: boolean;
}

export type MetricId =
  | "passRate"
  | "failureCount"
  | "executionTime"
  | "loginTime"
  | "ajaxLoad"
  | "pageLoad";

export interface QueryTemplate {
  id: string;
  name: string;
  category: string;
  requiredFilters: string[];
  optionalFilters: string[];
  metrics: MetricId[];
  outputs: Array<"singleNumber" | "table" | "chart" | "scenarioList" | "narrative">;
}

export interface Dataset {
  environments: Environment[];
  features: Feature[];
  runs: RegressionRun[];
  executions: ScenarioExecution[];
  tasks: Task[];
  xmlDocuments: XmlHelperDocument[];
  sources: DataSource[];
  queryTemplates: QueryTemplate[];
}
