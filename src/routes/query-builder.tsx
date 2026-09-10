import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { EmptyState, Panel, StatusBadge } from "@/components/common/Primitives";
import { TrendChart } from "@/components/charts/TrendChart";
import {
  featureStats,
  filterExecutions,
  filterRuns,
  formatDateTime,
  metricAvailable,
  metricLabels,
  metricUnits,
  metricValue,
  recentExecutions,
  trendSeries,
} from "@/services/analytics";
import type { MetricId } from "@/models/types";
import { useFilters } from "@/state/filters";

export const Route = createFileRoute("/query-builder")({
  head: () => ({
    meta: [
      { title: "Query Builder | Regression Intelligence" },
      {
        name: "description",
        content:
          "Compose regression questions from templates: pick a metric and outputs, and read results computed from the connected data.",
      },
      { property: "og:title", content: "Query Builder" },
      {
        property: "og:description",
        content: "Compose regression queries from templates and read results computed from connected data.",
      },
    ],
  }),
  component: QueryBuilder,
});

const metricOrder: MetricId[] = [
  "passRate",
  "failureCount",
  "executionTime",
  "loginTime",
  "ajaxLoad",
  "pageLoad",
];

function QueryBuilder() {
  const { dataset, filters } = useFilters();
  const [templateId, setTemplateId] = useState(dataset.queryTemplates[0]?.id ?? "");
  const template = dataset.queryTemplates.find((t) => t.id === templateId) ?? dataset.queryTemplates[0];

  const allowedMetrics = useMemo(
    () => (template?.metrics.length ? template.metrics : metricOrder),
    [template],
  );
  const [metric, setMetric] = useState<MetricId>(allowedMetrics[0] ?? "passRate");
  const activeMetric = allowedMetrics.includes(metric) ? metric : (allowedMetrics[0] ?? "passRate");

  const executions = filterExecutions(dataset, filters);
  const runs = filterRuns(dataset, filters);
  const available = metricAvailable(dataset, activeMetric);
  const value = available ? metricValue(activeMetric, executions, runs) : null;
  const stats = featureStats(dataset, executions).sort((a, b) => b.failures - a.failures);
  const trend = trendSeries(
    dataset,
    filters,
    activeMetric,
    dataset.environments.map((e) => e.id),
  );
  const outputs = template?.outputs ?? ["singleNumber"];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Query Builder</h1>
        <p className="text-xs text-muted-foreground">
          Templates are data, not code. Global filters above scope every query.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Panel title="Query" description="Pick a template and metric.">
          <div className="space-y-3">
            <label className="flex flex-col gap-1">
              <span className="label-caps">Template</span>
              <select
                className="h-8 rounded-md border border-input bg-card px-2 text-xs"
                value={template?.id ?? ""}
                onChange={(e) => setTemplateId(e.target.value)}
              >
                {dataset.queryTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.category} — {t.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="label-caps">Metric</span>
              <select
                className="h-8 rounded-md border border-input bg-card px-2 text-xs"
                value={activeMetric}
                onChange={(e) => setMetric(e.target.value as MetricId)}
              >
                {allowedMetrics.map((m) => (
                  <option key={m} value={m} disabled={!metricAvailable(dataset, m)}>
                    {metricLabels[m]}
                    {metricAvailable(dataset, m) ? "" : " (no data)"}
                  </option>
                ))}
              </select>
            </label>

            <div className="rounded-md border border-border p-2 text-[11px] text-muted-foreground">
              <p>
                <span className="label-caps">Required</span>{" "}
                {template?.requiredFilters.join(", ") || "none"}
              </p>
              <p className="mt-1">
                <span className="label-caps">Optional</span>{" "}
                {template?.optionalFilters.join(", ") || "none"}
              </p>
              <p className="mt-1">
                <span className="label-caps">Outputs</span> {outputs.join(", ")}
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-md border border-border p-2">
                <dt className="label-caps">Runs in scope</dt>
                <dd className="num mt-0.5">{runs.length}</dd>
              </div>
              <div className="rounded-md border border-border p-2">
                <dt className="label-caps">Scenarios</dt>
                <dd className="num mt-0.5">{executions.length}</dd>
              </div>
            </dl>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Result" description={`${metricLabels[activeMetric]} across the filtered data.`}>
            {value === null ? (
              <EmptyState
                title="No data for this metric"
                hint="The connected sources do not contain this measurement for the selected scope."
              />
            ) : (
              <p className="num text-4xl font-semibold">
                {value.toLocaleString()}
                <span className="ml-1 text-base text-muted-foreground">{metricUnits[activeMetric]}</span>
              </p>
            )}
          </Panel>

          {(outputs.includes("chart") || outputs.includes("table")) && (
            <Panel title="Trend" description="One series per environment in scope.">
              {trend.points.length && value !== null ? (
                <TrendChart points={trend.points} series={trend.series} unit={metricUnits[activeMetric]} />
              ) : (
                <EmptyState title="Nothing to chart" hint="Widen the date range or clear a filter." />
              )}
            </Panel>
          )}

          {outputs.includes("table") && (
            <Panel title="By feature file" description="Failures and duration per feature in scope.">
              {stats.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="text-left text-muted-foreground">
                      <tr>
                        <th className="py-1.5 pr-3 font-medium">Feature</th>
                        <th className="py-1.5 pr-3 font-medium">Scenarios</th>
                        <th className="py-1.5 pr-3 font-medium">Failures</th>
                        <th className="py-1.5 font-medium">Avg duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.map((s) => (
                        <tr key={s.featureId} className="border-t border-border">
                          <td className="py-1.5 pr-3">
                            {s.breakdownName} — {s.featureName}
                          </td>
                          <td className="num py-1.5 pr-3">{s.total}</td>
                          <td className="num py-1.5 pr-3">{s.failures}</td>
                          <td className="num py-1.5">{s.avgDuration.toFixed(2)} sec</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState title="No scenarios in scope" />
              )}
            </Panel>
          )}

          {outputs.includes("scenarioList") && (
            <Panel title="Matching scenarios" description="Most recent 15 executions in scope.">
              {executions.length ? (
                <ul className="divide-y divide-border text-xs">
                  {recentExecutions(executions, 15).map((e) => (
                    <li key={e.id} className="flex items-center justify-between gap-3 py-1.5">
                      <span className="min-w-0 truncate">{e.scenarioName}</span>
                      <span className="flex shrink-0 items-center gap-2">
                        <span className="num text-muted-foreground">{formatDateTime(e.timestamp)}</span>
                        <StatusBadge status={e.status} />
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState title="No scenarios in scope" />
              )}
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
