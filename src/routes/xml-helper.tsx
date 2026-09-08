import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { EmptyState, Panel } from "@/components/common/Primitives";
import { useFilters } from "@/state/filters";

export const Route = createFileRoute("/xml-helper")({
  head: () => ({
    meta: [
      { title: "XML Helper Library | Documentation Linked to Features" },
      {
        name: "description",
        content:
          "Search XML Helper documentation and link each document to the feature files and scenarios it describes.",
      },
      { property: "og:title", content: "XML Helper Library" },
      { property: "og:description", content: "Searchable XML Helper documentation linked to regression features." },
    ],
  }),
  component: XmlHelper,
});

function XmlHelper() {
  const { dataset } = useFilters();
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const docs = dataset.xmlDocuments.filter((d) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      d.title.toLowerCase().includes(q) ||
      d.body.toLowerCase().includes(q) ||
      d.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
  const open = docs.find((d) => d.id === openId) ?? null;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold">XML Helper</h1>
        <p className="text-xs text-muted-foreground">
          {dataset.xmlDocuments.length} documents in the library · linked to {dataset.features.length} feature files
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        <Panel
          title="Documents"
          action={
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, tag or body"
              className="h-8 w-52 rounded-md border border-input bg-card px-2 text-xs"
            />
          }
        >
          {docs.length ? (
            <ul className="divide-y divide-border text-xs">
              {docs.map((d) => (
                <li key={d.id}>
                  <button onClick={() => setOpenId(d.id)} className="w-full py-2 text-left hover:text-primary">
                    <span className="font-medium">{d.title}</span>
                    <span className="ml-2 text-[11px] text-muted-foreground">{d.tags.join(", ")}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No XML Helper documents connected"
              hint="Upload XML Helper documentation on the Data Sources page and it will appear here, searchable and linkable to features."
            />
          )}
        </Panel>

        <Panel title="Document" description="Full text with the features it is linked to.">
          {open ? (
            <div className="space-y-2 text-xs">
              <p className="text-sm font-semibold">{open.title}</p>
              <p className="text-[11px] text-muted-foreground">Updated {open.updatedAt}</p>
              <pre className="num max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-md border border-border bg-muted/40 p-3 text-[11px]">
                {open.body}
              </pre>
            </div>
          ) : (
            <EmptyState title="Nothing selected" hint="Documents you upload can be opened and read here." />
          )}
        </Panel>
      </div>

      <Panel title="Feature files awaiting documentation" description="Every feature currently without a linked document.">
        <ul className="grid gap-2 text-xs sm:grid-cols-2 xl:grid-cols-3">
          {dataset.features.map((f) => (
            <li key={f.id} className="rounded-md border border-border p-2.5">
              <p className="font-medium">{f.breakdownName}</p>
              <p className="text-[11px] text-muted-foreground">{f.name}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{f.scenarios.length} scenarios</p>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
