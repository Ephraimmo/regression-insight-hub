import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { RunStatus } from "@/models/types";

export function StatusBadge({ status, className }: { status: RunStatus; className?: string }) {
  const map: Record<RunStatus, string> = {
    passed: "bg-pass-muted text-pass border-pass/30",
    failed: "bg-fail-muted text-fail border-fail/30",
    blocked: "bg-blocked-muted text-blocked-foreground border-blocked/40",
    unknown: "bg-unknown-muted text-muted-foreground border-unknown/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        map[status],
        className,
      )}
    >
      {status}
    </span>
  );
}

export function Panel({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("panel flex flex-col", className)}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            {title && <h2 className="text-sm font-semibold text-foreground">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={cn("flex-1 p-4", bodyClassName)}>{children}</div>
    </section>
  );
}

export function EmptyState({ title, hint, className }: { title: string; hint?: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full min-h-28 flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/40 px-4 py-6 text-center",
        className,
      )}
    >
      <p className="text-sm font-medium text-foreground">{title}</p>
      {hint && <p className="mt-1 max-w-sm text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Delta({ value, lowerIsBetter = false }: { value: number | null; lowerIsBetter?: boolean }) {
  if (value === null) return <span className="text-xs text-muted-foreground">No comparison data</span>;
  const up = value > 0;
  const good = lowerIsBetter ? !up : up;
  const neutral = Math.abs(value) < 0.05;
  return (
    <span
      className={cn(
        "num text-xs font-semibold",
        neutral ? "text-muted-foreground" : good ? "text-pass" : "text-fail",
      )}
    >
      {neutral ? "→" : up ? "↑" : "↓"} {Math.abs(value).toFixed(1)}%
    </span>
  );
}

export function Bar({ value, tone = "primary" }: { value: number; tone?: "pass" | "fail" | "blocked" | "unknown" | "primary" }) {
  const tones: Record<string, string> = {
    pass: "bg-pass",
    fail: "bg-fail",
    blocked: "bg-blocked",
    unknown: "bg-unknown",
    primary: "bg-primary",
  };
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div className={cn("h-full rounded-full", tones[tone])} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function StatTile({
  label,
  value,
  sub,
  to,
  search,
  tone,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  to?: string;
  search?: Record<string, string>;
  tone?: "pass" | "fail";
}) {
  const inner = (
    <>
      <p className="label-caps">{label}</p>
      <p
        className={cn(
          "num mt-2 text-3xl font-semibold leading-none",
          tone === "pass" && "text-pass",
          tone === "fail" && "text-fail",
        )}
      >
        {value}
      </p>
      <div className="mt-2 min-h-4 text-xs text-muted-foreground">{sub}</div>
    </>
  );
  if (!to) return <div className="panel p-4">{inner}</div>;
  return (
    <Link
      to={to}
      search={search as never}
      className="panel block p-4 transition-colors hover:border-primary/50 hover:bg-accent/40"
    >
      {inner}
    </Link>
  );
}
