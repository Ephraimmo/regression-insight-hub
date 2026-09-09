import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, Panel } from "@/components/common/Primitives";
import { useFilters } from "@/state/filters";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks & Issues | Regression Intelligence" },
      {
        name: "description",
        content: "Track open and resolved regression issues linked to feature files, environments and teams.",
      },
      { property: "og:title", content: "Tasks & Issues" },
      { property: "og:description", content: "Regression issues linked to features, environments and teams." },
    ],
  }),
  component: Tasks,
});

function Tasks() {
  const { dataset } = useFilters();
  const open = dataset.tasks.filter((t) => t.status === "open");
  const resolved = dataset.tasks.filter((t) => t.status === "resolved");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Tasks</h1>
        <p className="text-xs text-muted-foreground">
          {open.length} open · {resolved.length} resolved
        </p>
      </div>

      {dataset.tasks.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {[
            { title: "Open", items: open },
            { title: "Resolved", items: resolved },
          ].map((group) => (
            <Panel key={group.title} title={group.title}>
              <ul className="space-y-2 text-xs">
                {group.items.map((t) => (
                  <li key={t.id} className="rounded-md border border-border p-2.5">
                    <p className="font-medium">{t.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {[t.featureId, t.environmentId, t.team].filter(Boolean).join(" · ") || "Unlinked"}
                    </p>
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      ) : (
        <Panel title="Task tracker">
          <EmptyState
            title="No task source connected"
            hint="Connect a task or issue tracker on the Data Sources page. Tasks will then be linked to feature files, environments and teams, and surfaced on the dashboard."
          />
        </Panel>
      )}
    </div>
  );
}
