import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { formatDuration } from "../../lib/format";

export function IrrigationReminderCard({ nextIrrigationInMs }: { nextIrrigationInMs: number }) {
  const [remaining, setRemaining] = useState(nextIrrigationInMs);

  useEffect(() => {
    setRemaining(nextIrrigationInMs);
    const id = setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [nextIrrigationInMs]);

  return (
    <GlassCard className="flex items-center justify-between">
      <div>
        <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">
          Next Irrigation Reminder
        </span>
        <p className="mt-2 font-mono text-2xl font-semibold text-ink-primary">
          {formatDuration(remaining)}
        </p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-water/10 text-water">
        <Timer size={18} />
      </div>
    </GlassCard>
  );
}
