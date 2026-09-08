import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { EmptyState, Panel, StatusBadge } from "@/components/common/Primitives";
import type { ScenarioExecution } from "@/models/types";
import { filterExecutions, formatDateTime, formatSeconds } from "@/services/analytics";
import { useFilters } from "@/state/filters";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Regression Results & Scenario Drill-down" },
      {
        name: "description",
        content:
          "Browse every scenario execution with steps, failed step, browser error and last successful step for each regression run.",
      },
      { property: "og:title", content: "Regression Results & Scenario Drill-down" },
      { property: "og:description", content: "Every scenario execution with full technical failure detail." },
    ],
  }),
  component: Results,
});

function Results() {
  const { dataset, filters } = useFilters();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ScenarioExecution | null>(null);

  const rows = useMemo(() => {
    const base = filterExecutions(dataset, filters).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    const q = search.trim().toLowerCase();
    return q
      ? base.filter(
          (e) =>
            e.scenarioName.toLowerCase().includes(q) ||
            e.featureName.toLowerCase().includes(q) ||
            e.breakdownName.toLowerCase().includes(q) ||
            (e.failure?.message ?? "").toLowerCase().includes(q),
        )
      : base;
  }, [dataset, filters, search]);

  const page = rows.slice(0, 200);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Regression Results</h1>
        <p className="text-xs text-muted-foreground">
          {rows.length} scenario executions match the current filters{rows.length > 200 && " — showing the newest 200"}
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <Panel
          title="Scenario executions"
          bodyClassName="p-0"
          action={
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search scenario, feature or error"
              className="h-8 w-56 rounded-md border border-input bg-card px-2 text-xs"
            />
          }
        >
          {page.length ? (
            <div className="max-h-[70vh] overflow-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-muted/80 text-left backdrop-blur">
                  <tr className="label-caps">
                    <th className="px-3 py-2">Scenario</th>
                    <th className="px-3 py-2">Environment</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Duration</th>
                    <th className="px-3 py-2">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {page.map((e) => (
                    <tr
                      key={e.id}
                      onClick={() => setSelected(e)}
                      className={`cursor-pointer border-t border-border hover:bg-accent/50 ${
                        selected?.id === e.id ? "bg-accent/60" : ""
                      }`}
                    >
                      <td className="px-3 py-2">
                        <div className="font-medium">{e.scenarioName}</div>
                        <div className="text-[11px] text-muted-foreground">{e.breakdownName}</div>
                      </td>
                      <td className="px-3 py-2">
                        <div>{e.environmentId}</div>
                        <div className="num text-[11px] text-muted-foreground">{e.workerId}</div>
                      </td>
                      <td className="px-3 py-2">
                        <StatusBadge status={e.status} />
                      </td>
                      <td className="num px-3 py-2">{formatSeconds(e.duration)}</td>
                      <td className="num px-3 py-2 text-[11px] text-muted-foreground">{formatDateTime(e.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4">
              <EmptyState title="No executions match" hint="Adjust the global filters or clear the search." />
            </div>
          )}
        </Panel>

        <Panel title="Scenario detail" description="Steps, timings and captured failure information.">
          {selected ? (
            <div className="space-y-3 text-xs">
              <div>
                <p className="text-sm font-semibold">{selected.scenarioName}</p>
                <p className="text-[11px] text-muted-foreground">
                  {selected.featureName} · {selected.breakdownName}
                </p>
              </div>
              <dl className="grid grid-cols-2 gap-2">
                {[
                  ["Environment", selected.environmentId],
                  ["Run", selected.runId],
                  ["Scenario ID", selected.scenarioId],
                  ["Worker", selected.workerId],
                  ["Duration", formatSeconds(selected.duration)],
                  ["Executed", selected.actuallyExecuted ? "Yes" : "No — blocked"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-md border border-border p-2">
                    <dt className="label-caps">{k}</dt>
                    <dd className="num mt-0.5 truncate text-[11px]">{v}</dd>
                  </div>
                ))}
              </dl>

              <div>
                <p className="label-caps mb-1">Steps</p>
                <ul className="divide-y divide-border rounded-md border border-border">
                  {selected.steps.map((s, i) => (
                    <li key={i} className="flex items-center justify-between gap-2 px-2.5 py-1.5">
                      <span className="min-w-0 truncate">
                        <span className="num mr-1.5 text-[11px] text-primary">{s.keyword}</span>
                        {s.name}
                      </span>
                      <span className="flex items-center gap-2 whitespace-nowrap">
                        <span className="num text-[11px] text-muted-foreground">{s.duration.toFixed(2)}s</span>
                        <StatusBadge status={s.status} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {selected.failure ? (
                <div className="rounded-md border border-fail/30 bg-fail-muted/60 p-2.5">
                  <p className="label-caps">Failure</p>
                  <p className="mt-1 font-semibold text-fail">{selected.failure.message}</p>
                  {selected.failure.lastSuccessfulStep && (
                    <p className="mt-1.5">
                      <span className="label-caps">Last successful step</span>
                      <br />
                      {selected.failure.lastSuccessfulStep}
                    </p>
                  )}
                  {selected.failure.failedStep && (
                    <p className="mt-1.5">
                      <span className="label-caps">Failed step</span>
                      <br />
                      {selected.failure.failedStep}
                    </p>
                  )}
                  {selected.failure.browserError ? (
                    <pre className="num mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded bg-card p-2 text-[10px]">
                      {selected.failure.browserError}
                    </pre>
                  ) : (
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      No browser error was captured for this failure.
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground">No failure information — this scenario did not fail.</p>
              )}
            </div>
          ) : (
            <EmptyState title="Select a scenario" hint="Click any row to inspect its steps and failure detail." />
          )}
        </Panel>
      </div>
    </div>
  );
}
