import { AlertTriangle, CheckCircle2, Info, OctagonAlert } from "lucide-react";
import { Alert } from "../../types/domain";
import { ALERT_TYPE_LABELS } from "../../lib/format";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

const SEVERITY_ICON = {
  info: Info,
  warning: AlertTriangle,
  critical: OctagonAlert,
};

const SEVERITY_TONE = {
  info: "info" as const,
  warning: "warning" as const,
  critical: "danger" as const,
};

export function AlertRow({
  alert,
  onResolve,
  resolving,
}: {
  alert: Alert;
  onResolve?: (id: string) => void;
  resolving?: boolean;
}) {
  const Icon = SEVERITY_ICON[alert.severity];

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-base-border bg-surface px-4 py-3">
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{
            backgroundColor:
              alert.severity === "critical"
                ? "rgba(242,85,76,0.12)"
                : alert.severity === "warning"
                ? "rgba(245,197,66,0.12)"
                : "rgba(45,212,191,0.12)",
            color:
              alert.severity === "critical" ? "#F2554C" : alert.severity === "warning" ? "#F5C542" : "#2DD4BF",
          }}
        >
          <Icon size={16} />
        </div>
        <div>
          <p className="text-sm font-medium text-ink-primary">{ALERT_TYPE_LABELS[alert.type] ?? alert.type}</p>
          <p className="text-xs text-ink-faint">{alert.message}</p>
          <p className="mt-0.5 text-[11px] text-ink-faint">
            {new Date(alert.createdAt).toLocaleString(undefined, { hour12: false })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge tone={alert.resolved ? "success" : SEVERITY_TONE[alert.severity]}>
          {alert.resolved ? "Resolved" : alert.severity}
        </Badge>
        {!alert.resolved && onResolve && (
          <Button variant="ghost" onClick={() => onResolve(alert._id)} disabled={resolving}>
            <CheckCircle2 size={14} />
            {resolving ? "Resolving..." : "Resolve"}
          </Button>
        )}
      </div>
    </div>
  );
}
