import { createFileRoute } from "@tanstack/react-router";

import { Panel } from "@/components/common/Primitives";
import { formatDateTime } from "@/services/analytics";
import { useFilters } from "@/state/filters";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings | Regression Intelligence" },
      {
        name: "description",
        content: "Platform configuration: data mode, default filters, metric availability and information model status.",
      },
      { property: "og:title", content: "Settings" },
      { property: "og:description", content: "Configuration and information-model status for the platform." },
    ],
  }),
  component: Settings,
});

function Settings() {
  const { dataset, filters, resetFilters, demoMode, lastUpdated } = useFilters();

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Settings</h1>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Data mode">
          <p className="text-xs text-muted-foreground">
            {demoMode
              ? "Running on the bundled demo regression dataset. Connect a source to switch to your own exports."
              : "Running on connected data."}
          </p>
          <p className="num mt-2 text-[11px] text-muted-foreground">Last refreshed {formatDateTime(lastUpdated)}</p>
        </Panel>

        <Panel title="Current global filters" action={
          <button onClick={resetFilters} className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent">
            Reset
          </button>
        }>
          <dl className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(filters).map(([k, v]) => (
              <div key={k} className="rounded-md border border-border p-2">
                <dt className="label-caps">{k}</dt>
                <dd className="num mt-0.5">{String(v)}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel title="Information model" className="lg:col-span-2">
          <dl className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            {[
              ["Environments", dataset.environments.length],
              ["Feature files", dataset.features.length],
              ["Runs", dataset.runs.length],
              ["Scenario executions", dataset.executions.length],
              ["Tasks", dataset.tasks.length],
              ["XML documents", dataset.xmlDocuments.length],
              ["Query templates", dataset.queryTemplates.length],
              ["Sources", dataset.sources.length],
            ].map(([k, v]) => (
              <div key={String(k)} className="rounded-md border border-border p-2">
                <dt className="label-caps">{k}</dt>
                <dd className="num mt-0.5 text-base font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>
    </div>
  );
}
