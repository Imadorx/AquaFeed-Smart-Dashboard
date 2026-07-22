import { NavLink } from "react-router-dom";
import { Droplets, LayoutGrid, LineChart, Settings as SettingsIcon, Siren } from "lucide-react";
import { cn } from "../../lib/cn";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutGrid },
  { to: "/analytics", label: "Analytics", icon: LineChart },
  { to: "/alerts", label: "Alerts", icon: Siren },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-base-border bg-base-raised/60 px-4 py-6">
      <div className="flex items-center gap-2.5 px-2 pb-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-water/10 text-water">
          <Droplets size={20} strokeWidth={2.2} />
        </div>
        <div>
          <p className="font-display text-sm font-semibold leading-tight text-ink-primary">AquaFeed</p>
          <p className="text-[11px] uppercase tracking-wider text-ink-faint">Smart Dashboard</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-water/10 text-water"
                  : "text-ink-muted hover:bg-surface hover:text-ink-primary"
              )
            }
          >
            <Icon size={18} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="rounded-xl border border-base-border bg-surface px-3 py-3 text-[11px] leading-relaxed text-ink-faint">
        Unit 04 — Solar Hydroponic Bay
        <br />
        Casablanca Research Farm
      </div>
    </aside>
  );
}
