import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

import { Bar, Panel } from "@/components/common/Primitives";
import { environmentHealth, formatDateTime, formatPercent, formatSeconds } from "@/services/analytics";
import { useFilters } from "@/state/filters";

export const Route = createFileRoute("/environments")({
  head: () => ({
    meta: [
      { title: "Environments & Releases | Regression Intelligence" },
      {
        name: "description",
        content: "Compare every regression environment and release: pass rate, failures, login, AJAX and page timings.",
      },
      { property: "og:title", content: "Environments & Releases" },
      { property: "og:description", content: "Side-by-side health of every regression environment." },
    ],
  }),
  component: Environments,
});

function Environments() {
  const { dataset, filters } = useFilters();
  const health = useMemo(() => environmentHealth(dataset, filters), [dataset, filters]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Environments</h1>
        <p className="text-xs text-muted-foreground">
          {dataset.environments.length} environments registered. Metrics respect the global filters.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {health.map((h) => {
          const env = dataset.environments.find((e) => e.id === h.environmentId)!;
          return (
            <Panel key={h.environmentId} title={env.name} description={`${env.release} · version ${env.version}`}>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="label-caps">Pass rate</span>
                    <span className="num font-semibold">{formatPercent(h.passRate)}</span>
                  </div>
                  <Bar value={h.passRate ?? 0} tone={(h.passRate ?? 0) >= 90 ? "pass" : "fail"} />
                </div>
                <dl className="grid grid-cols-2 gap-2">
                  {[
                    ["Runs", String(h.runs)],
                    ["Scenarios", String(h.total)],
                    ["Failed", String(h.failed)],
                    ["Avg scenario", formatSeconds(h.avgDuration)],
                    ["Login time", formatSeconds(h.loginTime)],
                    ["AJAX load", formatSeconds(h.ajaxLoad)],
                    ["Page load", formatSeconds(h.pageLoad)],
                    ["Latest run", h.latestRun ? formatDateTime(h.latestRun) : "No data"],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-md border border-border p-2">
                      <dt className="label-caps">{k}</dt>
                      <dd className="num mt-0.5 truncate text-[11px]">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
