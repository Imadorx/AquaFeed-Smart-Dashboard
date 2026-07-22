import { LucideIcon } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { cn } from "../../lib/cn";

interface SensorCardProps {
  label: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  accent: string;
  precision?: number;
  helper?: string;
}

export function SensorCard({
  label,
  value,
  unit,
  icon: Icon,
  accent,
  precision = 1,
  helper,
}: SensorCardProps) {
  return (
    <GlassCard glowColor={`${accent}33`} className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">{label}</span>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${accent}1A`, color: accent }}
        >
          <Icon size={16} strokeWidth={2.2} />
        </div>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-3xl font-semibold text-ink-primary">
          {value.toFixed(precision)}
        </span>
        <span className="text-sm text-ink-muted">{unit}</span>
      </div>
      {helper && <p className={cn("text-xs text-ink-faint")}>{helper}</p>}
    </GlassCard>
  );
}
