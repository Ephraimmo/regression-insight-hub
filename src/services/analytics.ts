import type {
  Dataset,
  MetricId,
  RegressionRun,
  RunStatus,
  ScenarioExecution,
} from "@/models/types";

export interface GlobalFilters {
  environment: string; // "all" | environment id
  version: string; // "all" | version
  feature: string; // "all" | feature id
  scenario: string; // "all" | scenario name
  status: string; // "all" | RunStatus
  from: string; // ISO date (yyyy-mm-dd)
  to: string; // ISO date (yyyy-mm-dd)
}

export const dayKey = (iso: string) => iso.slice(0, 10);

export function defaultFilters(dataset: Dataset): GlobalFilters {
  const dates = dataset.runs.map((r) => dayKey(r.startedAt)).sort();
  const to = dates[dates.length - 1] ?? dayKey(new Date().toISOString());
  const from = dates[Math.max(0, dates.length - 3 * 21)] ?? to;
  return { environment: "all", version: "all", feature: "all", scenario: "all", status: "all", from, to };
}

export function matchesEnvironment(f: GlobalFilters, environmentId: string, version: string) {
  if (f.environment !== "all" && f.environment !== environmentId) return false;
  if (f.version !== "all" && f.version !== version) return false;
  return true;
}

export function filterExecutions(dataset: Dataset, f: GlobalFilters): ScenarioExecution[] {
  const versionOf = new Map(dataset.environments.map((e) => [e.id, e.version]));
  return dataset.executions.filter((e) => {
    if (!matchesEnvironment(f, e.environmentId, versionOf.get(e.environmentId) ?? "")) return false;
    if (f.feature !== "all" && e.featureId !== f.feature) return false;
    if (f.scenario !== "all" && e.scenarioName !== f.scenario) return false;
    if (f.status !== "all" && e.status !== f.status) return false;
    const d = dayKey(e.timestamp);
    return d >= f.from && d <= f.to;
  });
}

export function filterRuns(dataset: Dataset, f: GlobalFilters): RegressionRun[] {
  const versionOf = new Map(dataset.environments.map((e) => [e.id, e.version]));
  return dataset.runs.filter((r) => {
    if (!matchesEnvironment(f, r.environmentId, versionOf.get(r.environmentId) ?? "")) return false;
    const d = dayKey(r.startedAt);
    return d >= f.from && d <= f.to;
  });
}

export interface Summary {
  runs: number;
  scenarios: number;
  passed: number;
  failed: number;
  blocked: number;
  unknown: number;
  passRate: number | null;
  failRate: number | null;
  avgDuration: number | null;
}

export function summarise(executions: ScenarioExecution[], runCount: number): Summary {
  const count = (s: RunStatus) => executions.filter((e) => e.status === s).length;
  const passed = count("passed");
  const failed = count("failed");
  const total = executions.length;
  const avg = total ? executions.reduce((a, e) => a + e.duration, 0) / total : null;
  return {
    runs: runCount,
    scenarios: total,
    passed,
    failed,
    blocked: count("blocked"),
    unknown: count("unknown"),
    passRate: total ? (passed / total) * 100 : null,
    failRate: total ? (failed / total) * 100 : null,
    avgDuration: avg === null ? null : Math.round(avg * 100) / 100,
  };
}

/** Same-length window immediately before the selected range. */
export function previousPeriod(f: GlobalFilters): { from: string; to: string } {
  const from = new Date(`${f.from}T00:00:00Z`).getTime();
  const to = new Date(`${f.to}T00:00:00Z`).getTime();
  const span = Math.max(86400000, to - from + 86400000);
  return {
    from: new Date(from - span).toISOString().slice(0, 10),
    to: new Date(from - 86400000).toISOString().slice(0, 10),
  };
}

export function percentChange(current: number | null, previous: number | null): number | null {
  if (current === null || previous === null || previous === 0) return null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

export function averageRunMetric(runs: RegressionRun[], metric: "loginTime" | "ajaxLoad" | "pageLoad"): number | null {
  const values = runs.map((r) => r[metric]).filter((v): v is number => typeof v === "number");
  if (!values.length) return null;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100;
}

export interface EnvironmentHealth {
  environmentId: string;
  version: string;
  runs: number;
  passed: number;
  failed: number;
  total: number;
  passRate: number | null;
  avgDuration: number | null;
  loginTime: number | null;
  ajaxLoad: number | null;
  pageLoad: number | null;
  latestRun: string | null;
}

export function environmentHealth(dataset: Dataset, f: GlobalFilters): EnvironmentHealth[] {
  return dataset.environments.map((env) => {
    const scoped: GlobalFilters = { ...f, environment: env.id, status: "all" };
    const execs = filterExecutions(dataset, scoped);
    const runs = filterRuns(dataset, scoped);
    const s = summarise(execs, runs.length);
    const latest = runs.map((r) => r.startedAt).sort().pop() ?? null;
    return {
      environmentId: env.id,
      version: env.version,
      runs: runs.length,
      passed: s.passed,
      failed: s.failed,
      total: s.scenarios,
      passRate: s.passRate,
      avgDuration: s.avgDuration,
      loginTime: averageRunMetric(runs, "loginTime"),
      ajaxLoad: averageRunMetric(runs, "ajaxLoad"),
      pageLoad: averageRunMetric(runs, "pageLoad"),
      latestRun: latest,
    };
  });
}

export const metricLabels: Record<MetricId, string> = {
  passRate: "Pass Rate",
  failureCount: "Failure Count",
  executionTime: "Execution Time",
  loginTime: "Login Time",
  ajaxLoad: "AJAX Load Time",
  pageLoad: "Page Load Time",
};

export const metricUnits: Record<MetricId, string> = {
  passRate: "%",
  failureCount: "",
  executionTime: "s",
  loginTime: "s",
  ajaxLoad: "s",
  pageLoad: "s",
};

export function metricAvailable(dataset: Dataset, metric: MetricId): boolean {
  switch (metric) {
    case "loginTime":
      return dataset.runs.some((r) => r.loginTime !== null);
    case "ajaxLoad":
      return dataset.runs.some((r) => r.ajaxLoad !== null);
    case "pageLoad":
      return dataset.runs.some((r) => r.pageLoad !== null);
    default:
      return dataset.executions.length > 0;
  }
}

/** Metric value for one bucket of executions + runs. */
export function metricValue(
  metric: MetricId,
  executions: ScenarioExecution[],
  runs: RegressionRun[],
): number | null {
  switch (metric) {
    case "passRate": {
      if (!executions.length) return null;
      return Math.round((executions.filter((e) => e.status === "passed").length / executions.length) * 1000) / 10;
    }
    case "failureCount":
      return executions.filter((e) => e.status === "failed").length;
    case "executionTime": {
      if (!executions.length) return null;
      return Math.round((executions.reduce((a, e) => a + e.duration, 0) / executions.length) * 100) / 100;
    }
    case "loginTime":
      return averageRunMetric(runs, "loginTime");
    case "ajaxLoad":
      return averageRunMetric(runs, "ajaxLoad");
    case "pageLoad":
      return averageRunMetric(runs, "pageLoad");
  }
}

export interface TrendPoint {
  date: string;
  [series: string]: string | number | null;
}

/** One series per environment (or a single "All" series when one env is selected). */
export function trendSeries(
  dataset: Dataset,
  f: GlobalFilters,
  metric: MetricId,
  environmentIds: string[],
): { points: TrendPoint[]; series: string[] } {
  const execs = filterExecutions(dataset, { ...f, status: "all" });
  const runs = filterRuns(dataset, f);
  const dates = Array.from(new Set(runs.map((r) => dayKey(r.startedAt)))).sort();
  const series = environmentIds.filter((id) =>
    f.environment === "all" ? true : id === f.environment,
  );
  const points = dates.map((date) => {
    const point: TrendPoint = { date };
    for (const env of series) {
      const e = execs.filter((x) => x.environmentId === env && dayKey(x.timestamp) === date);
      const r = runs.filter((x) => x.environmentId === env && dayKey(x.startedAt) === date);
      point[env] = e.length || r.length ? metricValue(metric, e, r) : null;
    }
    return point;
  });
  return { points, series };
}

export interface FeatureStat {
  featureId: string;
  featureName: string;
  breakdownName: string;
  failures: number;
  total: number;
  avgDuration: number;
  runs: number;
}

export function featureStats(dataset: Dataset, executions: ScenarioExecution[]): FeatureStat[] {
  const map = new Map<string, FeatureStat>();
  for (const e of executions) {
    const cur =
      map.get(e.featureId) ??
      {
        featureId: e.featureId,
        featureName: e.featureName,
        breakdownName: e.breakdownName,
        failures: 0,
        total: 0,
        avgDuration: 0,
        runs: 0,
      };
    cur.total += 1;
    cur.avgDuration += e.duration;
    if (e.status === "failed") cur.failures += 1;
    map.set(e.featureId, cur);
  }
  const runsByFeature = new Map<string, Set<string>>();
  for (const e of executions) {
    const set = runsByFeature.get(e.featureId) ?? new Set<string>();
    set.add(e.runId);
    runsByFeature.set(e.featureId, set);
  }
  return Array.from(map.values()).map((s) => ({
    ...s,
    runs: runsByFeature.get(s.featureId)?.size ?? 0,
    avgDuration: Math.round((s.avgDuration / Math.max(1, s.total)) * 100) / 100,
  }));
}

export function recentExecutions(executions: ScenarioExecution[], limit: number): ScenarioExecution[] {
  return [...executions].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, limit);
}

export function scenarioOptions(dataset: Dataset, f: GlobalFilters): string[] {
  const versionOf = new Map(dataset.environments.map((e) => [e.id, e.version]));
  const set = new Set<string>();
  for (const e of dataset.executions) {
    if (!matchesEnvironment(f, e.environmentId, versionOf.get(e.environmentId) ?? "")) continue;
    if (f.feature !== "all" && e.featureId !== f.feature) continue;
    set.add(e.scenarioName);
  }
  return Array.from(set).sort();
}

export function featureOptions(dataset: Dataset, f: GlobalFilters) {
  const versionOf = new Map(dataset.environments.map((e) => [e.id, e.version]));
  const ids = new Set<string>();
  for (const e of dataset.executions) {
    if (!matchesEnvironment(f, e.environmentId, versionOf.get(e.environmentId) ?? "")) continue;
    ids.add(e.featureId);
  }
  return dataset.features.filter((ft) => ids.has(ft.id));
}

export function formatSeconds(v: number | null, digits = 2) {
  return v === null ? "No data" : `${v.toFixed(digits)} sec`;
}
export function formatPercent(v: number | null, digits = 1) {
  return v === null ? "No data" : `${v.toFixed(digits)}%`;
}
export function formatDateTime(iso: string) {
  return new Date(iso).toISOString().replace("T", " ").slice(0, 19);
}
export function formatTime(iso: string) {
  return new Date(iso).toISOString().slice(11, 19);
}
export function formatDate(iso: string) {
  return new Date(iso).toISOString().slice(0, 10);
}
