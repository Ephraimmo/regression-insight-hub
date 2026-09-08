import { X } from "lucide-react";

import { featureOptions, scenarioOptions } from "@/services/analytics";
import { useFilters } from "@/state/filters";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="label-caps">{label}</span>
      {children}
    </label>
  );
}

const selectClass =
  "h-8 min-w-0 rounded-md border border-input bg-card px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40";

export function FilterBar() {
  const { dataset, filters, setFilters, resetFilters } = useFilters();
  const features = featureOptions(dataset, filters);
  const scenarios = scenarioOptions(dataset, filters);
  const versions = Array.from(new Set(dataset.environments.map((e) => e.version))).sort().reverse();

  return (
    <div className="flex flex-wrap items-end gap-3 border-t border-border px-4 py-2.5">
      <Field label="Environment">
        <select
          className={selectClass}
          value={filters.environment}
          onChange={(e) => setFilters({ environment: e.target.value })}
        >
          <option value="all">All environments</option>
          {dataset.environments.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Version">
        <select className={selectClass} value={filters.version} onChange={(e) => setFilters({ version: e.target.value })}>
          <option value="all">All versions</option>
          {versions.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Feature file">
        <select
          className={`${selectClass} max-w-64`}
          value={filters.feature}
          onChange={(e) => setFilters({ feature: e.target.value })}
        >
          <option value="all">All features</option>
          {features.map((f) => (
            <option key={f.id} value={f.id}>
              {f.breakdownName} — {f.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Scenario">
        <select
          className={`${selectClass} max-w-56`}
          value={filters.scenario}
          onChange={(e) => setFilters({ scenario: e.target.value })}
        >
          <option value="all">All scenarios</option>
          {scenarios.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Status">
        <select className={selectClass} value={filters.status} onChange={(e) => setFilters({ status: e.target.value })}>
          <option value="all">All statuses</option>
          <option value="passed">Passed</option>
          <option value="failed">Failed</option>
          <option value="blocked">Blocked</option>
          <option value="unknown">Unknown</option>
        </select>
      </Field>

      <Field label="From">
        <input
          type="date"
          className={selectClass}
          value={filters.from}
          onChange={(e) => setFilters({ from: e.target.value })}
        />
      </Field>

      <Field label="To">
        <input
          type="date"
          className={selectClass}
          value={filters.to}
          onChange={(e) => setFilters({ to: e.target.value })}
        />
      </Field>

      <button
        onClick={resetFilters}
        className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-card px-2.5 text-xs font-medium hover:bg-accent"
      >
        <X className="size-3.5" /> Reset
      </button>
    </div>
  );
}
