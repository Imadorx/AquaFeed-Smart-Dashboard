import { NavLink } from "react-router-dom";
import { LayoutGrid, LineChart, Settings as SettingsIcon, Siren } from "lucide-react";
import { cn } from "../../lib/cn";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutGrid },
  { to: "/analytics", label: "Analytics", icon: LineChart },
  { to: "/alerts", label: "Alerts", icon: Siren },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

export function MobileNav() {
  return (
    <nav className="md:hidden flex items-center justify-around border-t border-base-border bg-base-raised/90 px-2 py-2 backdrop-blur">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[11px]",
              isActive ? "text-water" : "text-ink-faint"
            )
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
