import { useCallback, useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { AppShell } from "../components/layout/AppShell";
import { GlassCard } from "../components/ui/GlassCard";
import { AlertRow } from "../components/alerts/AlertRow";
import { fetchActiveAlerts, fetchAlertHistory, resolveAlert } from "../services/api";
import { Alert } from "../types/domain";
import { useRealtimeDashboard } from "../hooks/useRealtimeDashboard";

export function AlertsPage() {
  const { connected } = useRealtimeDashboard();
  const [active, setActive] = useState<Alert[]>([]);
  const [history, setHistory] = useState<Alert[]>([]);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [activeAlerts, historyAlerts] = await Promise.all([
      fetchActiveAlerts(),
      fetchAlertHistory(),
    ]);
    setActive(activeAlerts);
    setHistory(historyAlerts);
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, [refresh]);

  async function handleResolve(id: string) {
    setResolvingId(id);
    try {
      await resolveAlert(id);
      await refresh();
    } finally {
      setResolvingId(null);
    }
  }

  return (
    <AppShell title="Alerts" connected={connected}>
      <div className="flex flex-col gap-6">
        <GlassCard>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-ink-faint">
            Current Alerts
          </p>
          {active.length === 0 ? (
            <div className="flex items-center gap-2 rounded-xl border border-base-border bg-surface px-4 py-6 text-sm text-ink-faint">
              <ShieldCheck size={16} className="text-leaf" />
              No active alerts — the farm is operating normally.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {active.map((alert) => (
                <AlertRow
                  key={alert._id}
                  alert={alert}
                  onResolve={handleResolve}
                  resolving={resolvingId === alert._id}
                />
              ))}
            </div>
          )}
        </GlassCard>

        <GlassCard>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-ink-faint">
            Alert History
          </p>
          <div className="flex flex-col gap-2">
            {history.length === 0 ? (
              <p className="text-sm text-ink-faint">No alerts have been recorded yet.</p>
            ) : (
              history.map((alert) => <AlertRow key={alert._id} alert={alert} />)
            )}
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}
