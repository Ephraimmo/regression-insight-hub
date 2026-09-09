import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

import { EmptyState, Panel } from "@/components/common/Primitives";
import { featureStats, filterExecutions, formatPercent, formatSeconds } from "@/services/analytics";
import { useFilters } from "@/state/filters";

export const Route = createFileRoute("/teams")({
  head: () => ({
    meta: [
      { title: "Teams & Ownership | Regression Intelligence" },
      {
        name: "description",
        content: "Feature ownership by team, with pass rate, failure counts and execution time per owned feature file.",
      },
      { property: "og:title", content: "Teams & Ownership" },
      { property: "og:description", content: "Regression quality grouped by owning team." },
    ],
  }),
  component: Teams,
});

function Teams() {
  const { dataset, filters } = useFilters();
  const execs = useMemo(() => filterExecutions(dataset, { ...filters, status: "all" }), [dataset, filters]);
  const stats = useMemo(() => featureStats(dataset, execs), [dataset, execs]);
  const teams = Array.from(new Set(dataset.features.map((f) => f.team).filter(Boolean))) as string[];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Teams</h1>
        <p className="text-xs text-muted-foreground">Ownership view over the filtered regression data.</p>
      </div>

      {teams.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {teams.map((team) => {
            const ids = dataset.features.filter((f) => f.team === team).map((f) => f.id);
            const owned = stats.filter((s) => ids.includes(s.featureId));
            const total = owned.reduce((a, s) => a + s.total, 0);
            const failures = owned.reduce((a, s) => a + s.failures, 0);
            return (
              <Panel key={team} title={team} description={`${owned.length} feature files owned`}>
                <p className="text-xs">
                  Pass rate {formatPercent(total ? ((total - failures) / total) * 100 : null)} · {failures} failures of{" "}
                  {total} executions
                </p>
              </Panel>
            );
          })}
        </div>
      ) : (
        <Panel title="Team ownership">
          <EmptyState
            title="No team ownership defined in the connected data"
            hint="Supply a team or owner column with the feature files and this page will group quality metrics by team."
          />
        </Panel>
      )}

      <Panel title="Unowned feature files" bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/60 text-left">
              <tr className="label-caps">
                <th className="px-4 py-2">Breakdown</th>
                <th className="px-3 py-2">Feature file</th>
                <th className="px-3 py-2">Executions</th>
                <th className="px-3 py-2">Failures</th>
                <th className="px-3 py-2">Avg duration</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((s) => (
                <tr key={s.featureId} className="border-t border-border">
                  <td className="px-4 py-2 font-medium">{s.breakdownName}</td>
                  <td className="px-3 py-2 text-muted-foreground">{s.featureName}</td>
                  <td className="num px-3 py-2">{s.total}</td>
                  <td className="num px-3 py-2 text-fail">{s.failures}</td>
                  <td className="num px-3 py-2">{formatSeconds(s.avgDuration)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
