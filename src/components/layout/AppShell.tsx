import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Bot,
  Boxes,
  Database,
  FileCode2,
  FileText,
  LayoutDashboard,
  ListChecks,
  RefreshCw,
  Settings as SettingsIcon,
  Terminal,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { useFilters } from "@/state/filters";
import { formatDateTime } from "@/services/analytics";
import { FilterBar } from "@/components/common/FilterBar";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/results", label: "Regression Results", icon: Activity },
  { to: "/assistant", label: "Assistant", icon: Bot },
  { to: "/xml-helper", label: "XML Helper", icon: FileCode2 },
  { to: "/query-builder", label: "Query Builder", icon: Terminal },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/teams", label: "Teams", icon: Users },
  { to: "/environments", label: "Environments", icon: Boxes },
  { to: "/data-sources", label: "Data Sources", icon: Database },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { demoMode, lastUpdated, refresh } = useFilters();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col bg-nav text-nav-foreground lg:flex">
        <div className="px-4 py-5">
          <p className="text-sm font-semibold tracking-tight">Regression Intelligence</p>
          <p className="mt-0.5 text-[11px] text-nav-muted">XML Helper &amp; QA analytics</p>
        </div>
        <nav className="flex-1 space-y-0.5 px-2 pb-4">
          {nav.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] transition-colors",
                  active ? "bg-nav-active font-semibold text-nav-foreground" : "text-nav-muted hover:bg-nav-active/60",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 px-4 py-3 text-[11px] text-nav-muted">
          {demoMode ? "Demo data connected" : "Live data"}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
            <div className="flex items-center gap-2 overflow-x-auto lg:hidden">
              {nav.slice(0, 5).map((item) => (
                <Link key={item.to} to={item.to} className="whitespace-nowrap text-xs text-muted-foreground">
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="hidden lg:block">
              <span className="label-caps">Global filters</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="num text-[11px] text-muted-foreground">
                Updated {formatDateTime(lastUpdated)}
              </span>
              <button
                onClick={refresh}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium hover:bg-accent"
              >
                <RefreshCw className="size-3.5" /> Refresh
              </button>
            </div>
          </div>
          <FilterBar />
        </header>
        <main className="min-w-0 flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
