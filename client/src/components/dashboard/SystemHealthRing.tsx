import { SystemHealthStatus } from "../../types/domain";
import { cn } from "../../lib/cn";

const STATUS_META: Record<SystemHealthStatus, { color: string; label: string; sweep: number }> = {
  healthy: { color: "#7CD46B", label: "Healthy", sweep: 0.86 },
  warning: { color: "#F5C542", label: "Warning", sweep: 0.55 },
  critical: { color: "#F2554C", label: "Critical", sweep: 0.22 },
};

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function SystemHealthRing({
  status,
  activeAlerts,
}: {
  status: SystemHealthStatus;
  activeAlerts: number;
}) {
  const meta = STATUS_META[status];
  const dashOffset = CIRCUMFERENCE * (1 - meta.sweep);

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="relative h-40 w-40">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            stroke="var(--color-base-border)"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            stroke={meta.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{
              transition: "stroke-dashoffset 0.8s ease, stroke 0.5s ease",
              filter: `drop-shadow(0 0 10px ${meta.color}80)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn("h-2.5 w-2.5 rounded-full")}
            style={{ backgroundColor: meta.color, boxShadow: `0 0 12px ${meta.color}` }}
          />
          <span className="mt-2 font-display text-base font-semibold text-ink-primary">
            {meta.label}
          </span>
          <span className="text-[11px] text-ink-faint">
            {activeAlerts === 0 ? "no active alerts" : `${activeAlerts} active alert${activeAlerts > 1 ? "s" : ""}`}
          </span>
        </div>
      </div>
    </div>
  );
}
