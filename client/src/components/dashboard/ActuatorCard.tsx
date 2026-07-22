import { LucideIcon } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { cn } from "../../lib/cn";

interface ActuatorCardProps {
  label: string;
  active: boolean;
  icon: LucideIcon;
  accent: string;
  activeLabel: string;
  idleLabel: string;
}

export function ActuatorCard({ label, active, icon: Icon, accent, activeLabel, idleLabel }: ActuatorCardProps) {
  return (
    <GlassCard glowColor={active ? `${accent}33` : undefined} className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">{label}</span>
        <div
          className={cn("flex h-8 w-8 items-center justify-center rounded-lg transition-colors")}
          style={{
            backgroundColor: active ? `${accent}1A` : "var(--color-surface)",
            color: active ? accent : "var(--color-ink-faint)",
          }}
        >
          <Icon size={16} strokeWidth={2.2} className={active ? "animate-pulse-soft" : ""} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full"
          style={{
            backgroundColor: active ? accent : "var(--color-ink-faint)",
            boxShadow: active ? `0 0 10px ${accent}` : "none",
          }}
        />
        <span className="font-display text-lg font-semibold text-ink-primary">
          {active ? activeLabel : idleLabel}
        </span>
      </div>
    </GlassCard>
  );
}
