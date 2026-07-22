import { SystemHealthStatus } from "../../types/domain";
import { GlassCard } from "../ui/GlassCard";
import { SystemHealthRing } from "./SystemHealthRing";

export function SystemHealthCard({
  status,
  activeAlerts,
}: {
  status: SystemHealthStatus;
  activeAlerts: number;
}) {
  return (
    <GlassCard className="flex flex-col items-center justify-center">
      <span className="mb-1 self-start text-xs font-medium uppercase tracking-wider text-ink-faint">
        System Health
      </span>
      <SystemHealthRing status={status} activeAlerts={activeAlerts} />
    </GlassCard>
  );
}
