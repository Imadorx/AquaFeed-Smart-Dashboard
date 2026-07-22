import { useEffect, useState } from "react";
import { Moon, Sun, Wifi, WifiOff } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { formatDateTime } from "../../lib/format";
import { Badge, StatusDot } from "../ui/Badge";

export function Navbar({ title, connected }: { title: string; connected: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const { date, time } = formatDateTime(now);

  return (
    <header className="flex items-center justify-between gap-4 border-b border-base-border px-6 py-4">
      <div>
        <h1 className="font-display text-lg font-semibold text-ink-primary">{title}</h1>
        <p className="text-xs text-ink-faint">Live production telemetry, updated every second</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end font-mono leading-tight">
          <span className="text-sm text-ink-primary">{time}</span>
          <span className="text-[11px] text-ink-faint">{date}</span>
        </div>

        <Badge tone={connected ? "success" : "danger"}>
          <StatusDot tone={connected ? "success" : "danger"} pulse={connected} />
          {connected ? "Live" : "Offline"}
          {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
        </Badge>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-base-border bg-surface text-ink-muted transition-colors hover:text-ink-primary hover:bg-surface-hover"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
