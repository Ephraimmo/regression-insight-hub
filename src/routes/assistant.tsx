import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { EmptyState, Panel } from "@/components/common/Primitives";
import { answerQuestion, suggestedQuestions, type AssistantAnswer } from "@/services/assistant";
import { useFilters } from "@/state/filters";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Regression Assistant | Ask Your QA Data" },
      {
        name: "description",
        content:
          "Ask questions about pass rates, failures, login, AJAX and page load times and get answers computed from the connected regression data.",
      },
      { property: "og:title", content: "Regression Assistant" },
      { property: "og:description", content: "Natural-language answers computed from your regression data." },
    ],
  }),
  component: Assistant,
});

function Assistant() {
  const { dataset, filters } = useFilters();
  const [input, setInput] = useState("");
  const [thread, setThread] = useState<AssistantAnswer[]>([]);

  const ask = (q: string) => {
    const question = q.trim();
    if (!question) return;
    setThread((prev) => [answerQuestion(dataset, filters, question), ...prev]);
    setInput("");
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Assistant</h1>
        <p className="text-xs text-muted-foreground">
          Answers are calculated from the filtered dataset. Nothing is invented — missing metrics are reported as
          missing.
        </p>
      </div>

      <Panel>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about pass rates, failures, login time, AJAX load, slow features…"
            className="h-9 min-w-0 flex-1 rounded-md border border-input bg-card px-3 text-sm"
          />
          <button className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Ask
          </button>
        </form>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => ask(q)}
              className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-accent"
            >
              {q}
            </button>
          ))}
        </div>
      </Panel>

      {thread.length ? (
        <div className="space-y-3">
          {thread.map((a, i) => (
            <Panel key={`${a.question}-${i}`} title={a.question} description={`Scope: ${a.scope}`}>
              <p className="text-sm font-semibold">{a.headline}</p>
              {a.narrative.map((n) => (
                <p key={n} className="mt-1 text-xs text-muted-foreground">
                  {n}
                </p>
              ))}
              {a.table && (
                <div className="mt-3 overflow-x-auto rounded-md border border-border">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/60 text-left">
                      <tr className="label-caps">
                        {a.table.columns.map((c) => (
                          <th key={c} className="px-3 py-2">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {a.table.rows.map((r, ri) => (
                        <tr key={ri} className="border-t border-border">
                          {r.map((cell, ci) => (
                            <td key={ci} className={ci > 1 ? "num px-3 py-2" : "px-3 py-2"}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {a.followUps.map((f) => (
                  <button
                    key={f}
                    onClick={() => ask(f)}
                    className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-accent"
                  >
                    {f}
                  </button>
                ))}
              </div>
            </Panel>
          ))}
        </div>
      ) : (
        <EmptyState title="No questions asked yet" hint="Start with one of the suggestions above." />
      )}
    </div>
  );
}
