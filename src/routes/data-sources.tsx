import { createFileRoute } from "@tanstack/react-router";

import { Panel } from "@/components/common/Primitives";
import { formatDateTime } from "@/services/analytics";
import { useFilters } from "@/state/filters";

export const Route = createFileRoute("/data-sources")({
  head: () => ({
    meta: [
      { title: "Data Sources | Regression Intelligence" },
      {
        name: "description",
        content:
          "Every connected data source: regression exports, Excel workbooks, XML Helper documentation and task trackers.",
      },
      { property: "og:title", content: "Data Sources" },
      { property: "og:description", content: "Regression exports, workbooks, XML Helper docs and task trackers." },
    ],
  }),
  component: DataSources;
});

function DataSources() {
  const { dataset } = useFilters();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Data Sources</h1>
        <p className="text-xs text-muted-foreground">
          The platform reads a unified information model. Add a source and every page picks it up.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {dataset.sources.map((s) => (
          <Panel key={s.id} title={s.name} description={s.detail}>
            <dl className="grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-md border border-border p-2">
                <dt className="label-caps">Type</dt>
                <dd className="mt-0.5">{s.type}</dd>
              </div>
              <div className="rounded-md border border-border p-2">
                <dt className="label-caps">Status</dt>
                <dd className={s.status === "connected" ? "mt-0.5 font-medium text-pass" : "mt-0.5 text-muted-foreground"}>
                  {s.status.replace("_", " ")}
                </dd>
              </div>
              <div className="rounded-md border border-border p-2">
                <dt className="label-caps">Records</dt>
                <dd className="num mt-0.5">{s.records === null ? "No data" : s.records.toLocaleString()}</dd>
              </div>
            </dl>
            <p className="mt-2 text-[11px] text-muted-foreground">
              {s.uploadedAt ? `Last ingested ${formatDateTime(s.uploadedAt)}` : "Not yet ingested"}
            </p>
          </Panel>
        ))}
      </div>

      <Panel title="How to extend the model" description="What the platform accepts without code changes.">
        <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
          <li>Regression exports add environments, releases, runs, scenarios, steps and failure detail.</li>
          <li>Excel workbooks add metrics such as login, AJAX and page load timings per run.</li>
          <li>XML Helper documents add searchable documentation linked to feature files.</li>
          <li>Task exports add issues linked to features, environments and teams.</li>
          <li>Metrics absent from a source are reported as "No data" rather than estimated.</li>
        </ul>
      </Panel>
    </div>
  );
}
