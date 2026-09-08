import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { TrendChart } from "@/components/charts/TrendChart";
import { Bar, Delta, EmptyState, Panel, StatTile, StatusBadge } from "@/components/common/Primitives";
import type { MetricId } from "@/models/types";
import {
  environmentHealth,
  featureStats,
  filterExecutions,
  filterRuns,
  formatPercent,
  formatSeconds,
  formatTime,
  metricAvailable,
  metricLabels,
  metricUnits,
  metricValue,
  percentChange,
  previousPeriod,
  recentExecutions,
  summarise,
  trendSeries,
  type GlobalFilters,
} from "@/services/analytics";
import { answerQuestion, suggestedQuestions } from "@/services/assistant";
import { useFilters } from "@/state/filters";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Regression Intelligence Dashboard | XML Helper Platform" },
      {
        name: "description",
        content:
          "Live regression intelligence: pass rates, failures, execution and page timings across every environment and release.",
      },
      { property: "og:title", content: "Regression Intelligence Dashboard" },
      {
        property: "og:description",
        content: "Pass rates, failures and performance timings across every regression environment.",
      },
    ],
  }),
  component: Dashboard,
});

const metricChoices: MetricId[] = ["passRate", "failureCount", "executionTime", "loginTime", "ajaxLoad", "pageLoad"];

function Dashboard() {
  const { dataset, filters } = useFilters();
  const [metric, setMetric] = useState<MetricId>("passRate");
  const [question, setQuestion] = useState("");

  const execs = useMemo(() => filterExecutions(dataset, { ...filters, status: "all" }), [dataset, filters]);
  const scoped = useMemo(() => filterExecutions(dataset, filters), [dataset, filters]);
  const runs = useMemo(() => filterRuns(dataset, filters), [dataset, filters]);
  const summary = useMemo(() => summarise(execs, runs.length), [execs, runs.length]);

  const prevWindow = useMemo(() => previousPeriod(filters), [filters]);
  const prevFilters: GlobalFilters = { ...filters, ...prevWindow };
  const prevExecs = useMemo(() => filterExecutions(dataset, { ...prevFilters, status: "all" }), [dataset, prevFilters]);
  const prevRuns = useMemo(() => filterRuns(dataset, prevFilters), [dataset, prevFilters]);
  const prevSummary = useMemo(() => summarise(prevExecs, prevRuns.length), [prevExecs, prevRuns.length]);

  const trend = useMemo(
    () => trendSeries(dataset, filters, metric, dataset.environments.map((e) => e.id)),
    [dataset, filters, metric],
  );
  const health = useMemo(() => environmentHealth(dataset, filters), [dataset, filters]);
  const stats = useMemo(() => featureStats(dataset, execs), [dataset, execs]);
  const topFailing = [...stats].sort((a, b) => b.failures - a.failures).filter((s) => s.failures > 0).slice(0, 6);
  const slowest = [...stats].sort((a, b) => b.avgDuration - a.avgDuration).slice(0, 6);
  const recent = useMemo(() => recentExecutions(scoped, 8), [scoped]);
  const failures = useMemo(
    () => recentExecutions(execs.filter((e) => e.status === "failed"), 6),
    [execs],
  );
  const answer = question.trim() ? answerQuestion(dataset, filters, question) : null;

  const openTasks = dataset.tasks.filter((t) => t.status === "open");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Regression Intelligence Dashboard</h1>
        <p className="text-xs text-muted-foreground">
          {runs.length} runs · {execs.length} scenario executions · {dataset.environments.length} environments in scope
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatTile
          label="Pass rate"
          value={formatPercent(summary.passRate)}
          tone={summary.passRate !== null && summary.passRate < 90 ? "fail" : "pass"}
          sub={<Delta value={percentChange(summary.passRate, prevSummary.passRate)} />}
        />
        <StatTile
          label="Failures"
          value={summary.failed}
          tone={summary.failed > 0 ? "fail" : undefined}
          sub={<Delta value={percentChange(summary.failed, prevSummary.failed)} lowerIsBetter />}
          to="/results"
        />
        <StatTile
          label="Avg scenario time"
          value={formatSeconds(summary.avgDuration)}
          sub={<Delta value={percentChange(summary.avgDuration, prevSummary.avgDuration)} lowerIsBetter />}
        />
        <StatTile
          label="Blocked / unknown"
          value={`${summary.blocked} / ${summary.unknown}`}
          sub={<span>Not executed or without a recorded result</span>}
        />
        <StatTile label="Runs analysed" value={summary.runs} sub={<span>Weekday regression batches</span>} />
      </div>

      <Panel
        title={`${metricLabels[metric]} trend`}
        description="One series per environment. Gaps mean the metric is absent from that export."
        action={
          <select
            className="h-8 rounded-md border border-input bg-card px-2 text-xs"
            value={metric}
            onChange={(e) => setMetric(e.target.value as MetricId)}
          >
            {metricChoices.map((m) => (
              <option key={m} value={m} disabled={!metricAvailable(dataset, m)}>
                {metricLabels[m]}
                {metricAvailable(dataset, m) ? "" : " (no data)"}
              </option>
            ))}
          </select>
        }
      >
        {trend.points.length ? (
          <TrendChart points={trend.points} series={trend.series} unit={metricUnits[metric]} />
        ) : (
          <EmptyState title="No runs in the selected range" hint="Widen the date range to plot a trend." />
        )}
      </Panel>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Environment health" className="xl:col-span-2" bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/60 text-left">
                <tr className="label-caps">
                  <th className="px-4 py-2">Environment</th>
                  <th className="px-3 py-2">Runs</th>
                  <th className="px-3 py-2">Pass rate</th>
                  <th className="px-3 py-2">Failed</th>
                  <th className="px-3 py-2">Avg time</th>
                  <th className="px-3 py-2">Login</th>
                  <th className="px-3 py-2">AJAX</th>
                  <th className="px-3 py-2">Page</th>
                </tr>
              </thead>
              <tbody>
                {health.map((h) => (
                  <tr key={h.environmentId} className="border-t border-border">
                    <td className="px-4 py-2">
                      <div className="font-semibold">{h.environmentId}</div>
                      <div className="text-[11px] text-muted-foreground">Version {h.version}</div>
                    </td>
                    <td className="num px-3 py-2">{h.runs}</td>
                    <td className="px-3 py-2">
                      <div className="num">{formatPercent(h.passRate)}</div>
                      <Bar value={h.passRate ?? 0} tone={(h.passRate ?? 0) >= 90 ? "pass" : "fail"} />
                    </td>
                    <td className="num px-3 py-2 text-fail">{h.failed}</td>
                    <td className="num px-3 py-2">{formatSeconds(h.avgDuration)}</td>
                    <td className="num px-3 py-2">{formatSeconds(h.loginTime)}</td>
                    <td className="num px-3 py-2">{formatSeconds(h.ajaxLoad)}</td>
                    <td className="num px-3 py-2">{formatSeconds(h.pageLoad)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Ask the assistant" description="Natural-language questions answered from the filtered data.">
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Compare login time across versions"
                className="h-9 min-w-0 flex-1 rounded-md border border-input bg-card px-2.5 text-xs"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {suggestedQuestions.slice(0, 4).map((q) => (
                <button
                  key={q}
                  onClick={() => setQuestion(q)}
                  className="rounded-full border border-border px-2 py-1 text-[11px] text-muted-foreground hover:bg-accent"
                >
                  {q}
                </button>
              ))}
            </div>
            {answer ? (
              <div className="rounded-md border border-border bg-muted/40 p-3">
                <p className="text-sm font-semibold">{answer.headline}</p>
                {answer.narrative.map((n) => (
                  <p key={n} className="mt-1 text-xs text-muted-foreground">
                    {n}
                  </p>
                ))}
                <Link to="/assistant" className="mt-2 inline-block text-[11px] font-medium text-primary">
                  Open full assistant →
                </Link>
              </div>
            ) : (
              <EmptyState title="No question asked yet" hint="Type a question or pick a suggestion above." />
            )}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Top failing features" description="Ranked by failure count in the selected window.">
          {topFailing.length ? (
            <ul className="space-y-2.5">
              {topFailing.map((s) => (
                <li key={s.featureId}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-xs font-medium">{s.breakdownName}</span>
                    <span className="num text-xs text-fail">
                      {s.failures}/{s.total}
                    </span>
                  </div>
                  <p className="truncate text-[11px] text-muted-foreground">{s.featureName}</p>
                  <Bar value={(s.failures / Math.max(1, s.total)) * 100} tone="fail" />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No failures recorded" hint="Every scenario in scope passed or was blocked." />
          )}
        </Panel>

        <Panel title="Slowest features" description="Average scenario execution time.">
          {slowest.length ? (
            <ul className="space-y-2.5">
              {slowest.map((s) => (
                <li key={s.featureId}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-xs font-medium">{s.breakdownName}</span>
                    <span className="num text-xs">{formatSeconds(s.avgDuration)}</span>
                  </div>
                  <Bar value={(s.avgDuration / Math.max(...slowest.map((x) => x.avgDuration))) * 100} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No executions in scope" />
          )}
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel
          title="Recent activity"
          description="Latest scenario executions matching the filters."
          action={
            <Link to="/results" className="text-[11px] font-medium text-primary">
              All results →
            </Link>
          }
        >
          {recent.length ? (
            <ul className="divide-y divide-border text-xs">
              {recent.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{e.scenarioName}</p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {e.environmentId} · {e.breakdownName} · {e.workerId}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="num text-[11px] text-muted-foreground">{formatTime(e.timestamp)}</span>
                    <StatusBadge status={e.status} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="Nothing matches the filters" hint="Try a wider date range or clear the status filter." />
          )}
        </Panel>

        <Panel title="Latest failures" description="Failed step and browser error captured at run time.">
          {failures.length ? (
            <ul className="space-y-2.5">
              {failures.map((e) => (
                <li key={e.id} className="rounded-md border border-fail/30 bg-fail-muted/60 p-2.5">
                  <p className="text-xs font-semibold">{e.scenarioName}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {e.environmentId} · {e.breakdownName}
                  </p>
                  <p className="mt-1 text-[11px] text-fail">{e.failure?.message}</p>
                  {e.failure?.failedStep && (
                    <p className="num mt-1 truncate text-[10px] text-muted-foreground">{e.failure.failedStep}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No failures in scope" />
          )}
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Open issues" description="Tasks linked to features and environments.">
          {openTasks.length ? (
            <ul className="space-y-2 text-xs">
              {openTasks.map((t) => (
                <li key={t.id} className="rounded-md border border-border p-2">
                  {t.title}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No task source connected"
              hint="Connect a task tracker on Data Sources to see open issues here."
            />
          )}
        </Panel>

        <Panel title="XML Helper" description="Documentation linked to feature files.">
          {dataset.xmlDocuments.length ? (
            <ul className="space-y-2 text-xs">
              {dataset.xmlDocuments.slice(0, 5).map((d) => (
                <li key={d.id}>{d.title}</li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No XML Helper documents yet"
              hint="Upload XML Helper documentation to search and link it to features."
            />
          )}
        </Panel>

        <Panel title="Data sources" description="What the platform is currently reading.">
          <ul className="space-y-2 text-xs">
            {dataset.sources.map((s) => (
              <li key={s.id} className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-medium">{s.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{s.detail}</p>
                </div>
                <span
                  className={
                    s.status === "connected"
                      ? "whitespace-nowrap rounded border border-pass/30 bg-pass-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase text-pass"
                      : "whitespace-nowrap rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground"
                  }
                >
                  {s.status.replace("_", " ")}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
