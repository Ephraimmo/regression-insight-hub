import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { EmptyState, Panel, StatusBadge } from "@/components/common/Primitives";
import {
  environmentHealth,
  featureStats,
  filterExecutions,
  filterRuns,
  formatDate,
  formatDateTime,
  formatPercent,
  formatSeconds,
  previousPeriod,
  percentChange,
  recentExecutions,
  summarise,
} from "@/services/analytics";
import { useFilters } from "@/state/filters";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports | Regression Intelligence" },
      {
        name: "description",
        content:
          "Generate a regression report for the selected scope: summary, environment comparison, failing features and recent failures.",
      },
      { property: "og:title", content: "Reports" },
      {
        property: "og:description",
        content: "Regression summary, environment comparison and failing features for the selected scope.",
      },
    ],
  }),
  component: Reports;
});

function Reports() {
  const { dataset, filters, lastUpdated } = useFilters();
  const [includeFailures, setIncludeFailures] = useState(true);

  const report = useMemo(() => {
    const executions = filterExecutions(dataset, filters);
    const runs = filterRuns(dataset, filters);
    const summary = summarise(executions, runs.length);
    const prev = previousPeriod(filters);
    const prevFilters = { ...filters, from: prev.from, to: prev.to };
    const prevSummary = summarise(
      filterExecutions(dataset, prevFilters),
      filterRuns(dataset, prevFilters).length,
    );
    return {
      executions,
      summary,
      prevSummary,
      prev,
      passRateChange: percentChange(summary.passRate, prevSummary.passRate),
      health: environmentHealth(dataset, filters).filter((h) => h.total > 0),
      features: featureStats(dataset, executions)
        .filter((f) => f.failures > 0)
        .sort((a, b) => b.failures - a.failures)
        .slice(0, 10),
      failures: recentExecutions(
        executions.filter((e) => e.status === "failed"),
        15,
      ),
    };
  }, [dataset, filters]);

  const scope = [
    filters.environment === "all" ? "All environments" : filters.environment,
    filters.version === "all" ? "All versions" : filters.version,
    filters.feature === "all" ? "All features" : filters.feature,
    filters.status === "all" ? "All statuses" : filters.status,
  ].join(" · ");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Reports</h1>
          <p className="text-xs text-muted-foreground">
            Built from the current global filters. Values absent from the sources are reported as "No data".
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs">
            <input
              type="checkbox"
              checked={includeFailures}
              onChange={(e) => setIncludeFailures(e.target.checked)}
            />
            Include failure detail
          </label>
          <button
            onClick={() => window.print()}
            className="inline-flex h-8 items-center rounded-md border border-border bg-card px-2.5 text-xs font-medium hover:bg-accent"
          >
            Print / Save as PDF
          </button>
        </div>
      </div>

      <Panel title="Report header" description={scope}>
        <dl className="grid gap-2 text-xs sm:grid-cols-4">
          <div className="rounded-md border border-border p-2">
            <dt className="label-caps">Period</dt>
            <dd className="num mt-0.5">
              {formatDate(`${filters.from}T00:00:00Z`)} → {formatDate(`${filters.to}T00:00:00Z`)}
            </dd>
          </div>
          <div className="rounded-md border border-border p-2">
            <dt className="label-caps">Compared with</dt>
            <dd className="num mt-0.5">
              {report.prev.from} → {report.prev.to}
            </dd>
          </div>
          <div className="rounded-md border border-border p-2">
            <dt className="label-caps">Runs analysed</dt>
            <dd className="num mt-0.5">{report.summary.runs}</dd>
          </div>
          <div className="rounded-md border border-border p-2">
            <dt className="label-caps">Generated</dt>
            <dd className="num mt-0.5">{formatDateTime(lastUpdated)}</dd>
          </div>
        </dl>
      </Panel>

      <Panel title="Summary" description="Scenario outcomes for the selected scope.">
        <dl className="grid gap-2 text-xs sm:grid-cols-3 lg:grid-cols-6">
          {[
            ["Scenarios", report.summary.scenarios.toString()],
            ["Pass rate", formatPercent(report.summary.passRate)],
            ["Failures", report.summary.failed.toString()],
            ["Blocked", report.summary.blocked.toString()],
            ["Unknown", report.summary.unknown.toString()],
            ["Avg duration", formatSeconds(report.summary.avgDuration)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md border border-border p-2">
              <dt className="label-caps">{label}</dt>
              <dd className="num mt-0.5 text-sm font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-muted-foreground">
          Pass rate previous period: {formatPercent(report.prevSummary.passRate)}
          {report.passRateChange === null
            ? " — no comparison available."
            : ` — change ${report.passRateChange > 0 ? "+" : ""}${report.passRateChange.toFixed(1)}%.`}
        </p>
      </Panel>

      <Panel title="Environment comparison" description="Only environments with data in scope are listed.">
        {report.health.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-left text-muted-foreground">
                <tr>
                  <th className="py-1.5 pr-3 font-medium">Environment</th>
                  <th className="py-1.5 pr-3 font-medium">Version</th>
                  <th className="py-1.5 pr-3 font-medium">Runs</th>
                  <th className="py-1.5 pr-3 font-medium">Pass rate</th>
                  <th className="py-1.5 pr-3 font-medium">Failures</th>
                  <th className="py-1.5 pr-3 font-medium">Login</th>
                  <th className="py-1.5 pr-3 font-medium">AJAX</th>
                  <th className="py-1.5 font-medium">Page load</th>
                </tr>
              </thead>
              <tbody>
                {report.health.map((h) => (
                  <tr key={h.environmentId} className="border-t border-border">
                    <td className="py-1.5 pr-3 font-medium">{h.environmentId}</td>
                    <td className="py-1.5 pr-3">{h.version}</td>
                    <td className="num py-1.5 pr-3">{h.runs}</td>
                    <td className="num py-1.5 pr-3">{formatPercent(h.passRate)}</td>
                    <td className="num py-1.5 pr-3">{h.failed}</td>
                    <td className="num py-1.5 pr-3">{formatSeconds(h.loginTime)}</td>
                    <td className="num py-1.5 pr-3">{formatSeconds(h.ajaxLoad)}</td>
                    <td className="num py-1.5">{formatSeconds(h.pageLoad)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No environment data in scope" hint="Widen the date range or clear a filter." />
        )}
      </Panel>

      <Panel title="Top failing features" description="Ranked by failure count in scope.">
        {report.features.length ? (
          <ul className="divide-y divide-border text-xs">
            {report.features.map((f) => (
              <li key={f.featureId} className="flex items-center justify-between gap-3 py-1.5">
                <span className="min-w-0 truncate">
                  {f.breakdownName} — {f.featureName}
                </span>
                <span className="num shrink-0 text-muted-foreground">
                  {f.failures} of {f.total} failed ({((f.failures / f.total) * 100).toFixed(1)}%)
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No failures in scope" hint="Every scenario in this selection passed or was skipped." />
        )}
      </Panel>

      {includeFailures && (
        <Panel title="Failure detail" description="Most recent failures with technical reason.">
          {report.failures.length ? (
            <ul className="space-y-2 text-xs">
              {report.failures.map((e) => (
                <li key={e.id} className="rounded-md border border-border p-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">{e.scenarioName}</span>
                    <span className="flex items-center gap-2">
                      <span className="num text-muted-foreground">{formatDateTime(e.timestamp)}</span>
                      <StatusBadge status={e.status} />
                    </span>
                  </div>
                  <p className="mt-1 text-muted-foreground">
                    {e.environmentId} · {e.breakdownName} — {e.featureName}
                  </p>
                  {e.failure ? (
                    <div className="mt-1 space-y-0.5 text-muted-foreground">
                      <p>Reason: {e.failure.message}</p>
                      {e.failure.failedStep && <p>Failed step: {e.failure.failedStep}</p>}
                      {e.failure.lastSuccessfulStep && <p>Last success: {e.failure.lastSuccessfulStep}</p>}
                      {e.failure.browserError && <p>Browser error: {e.failure.browserError}</p>}
                    </div>
                  ) : (
                    <p className="mt-1 text-muted-foreground">No failure detail captured in the source.</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No failure detail in scope" />
          )}
        </Panel>
      )}
    </div>
  );
}
