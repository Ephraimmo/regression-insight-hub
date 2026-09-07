import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import { demoDataset } from "@/data/demo-dataset";
import type { Dataset } from "@/models/types";
import { defaultFilters, type GlobalFilters } from "@/services/analytics";

interface FiltersContextValue {
  dataset: Dataset;
  filters: GlobalFilters;
  setFilters: (patch: Partial<GlobalFilters>) => void;
  resetFilters: () => void;
  demoMode: boolean;
  lastUpdated: string;
  refresh: () => void;
}

const FiltersContext = createContext<FiltersContextValue | null>(null);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const dataset = demoDataset;
  const initial = useMemo(() => defaultFilters(dataset), [dataset]);
  const [filters, setState] = useState<GlobalFilters>(initial);
  const [lastUpdated, setLastUpdated] = useState(() => new Date().toISOString());

  const value = useMemo<FiltersContextValue>(
    () => ({
      dataset,
      filters,
      setFilters: (patch) =>
        setState((prev) => {
          const next = { ...prev, ...patch };
          // cascade: changing environment or feature invalidates narrower selections
          if (patch.environment && patch.environment !== prev.environment) {
            next.feature = "all";
            next.scenario = "all";
          }
          if (patch.feature && patch.feature !== prev.feature) next.scenario = "all";
          return next;
        }),
      resetFilters: () => setState(initial),
      demoMode: true,
      lastUpdated,
      refresh: () => setLastUpdated(new Date().toISOString()),
    }),
    [dataset, filters, initial, lastUpdated],
  );

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useFilters must be used inside FiltersProvider");
  return ctx;
}
