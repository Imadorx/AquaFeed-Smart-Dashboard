import { useEffect, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { GlassCard } from "../components/ui/GlassCard";
import { HistoryChart } from "../components/charts/HistoryChart";
import { useHistory } from "../hooks/useHistory";
import { fetchStatistics } from "../services/api";
import { AnalyticsStatistics } from "../types/domain";
import { useRealtimeDashboard } from "../hooks/useRealtimeDashboard";

const RANGE_OPTIONS = [
  { label: "24h", hours: 24 },
  { label: "7d", hours: 24 * 7 },
  { label: "30d", hours: 24 * 30 },
];

function StatRow({ title, values }: { title: string; values: AnalyticsStatistics["dailyAverage"] }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">{title}</span>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatChip label="Temp" value={`${values.temperature.toFixed(1)}°C`} color="#F2554C" />
        <StatChip label="Humidity" value={`${values.humidity.toFixed(1)}%`} color="#2DD4BF" />
        <StatChip label="Water" value={`${values.waterLevel.toFixed(1)}%`} color="#38BDF8" />
        <StatChip label="Solar" value={`${values.solarPower.toFixed(2)}kW`} color="#F5A623" />
      </div>
    </div>
  );
}

function StatChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-base-border bg-surface px-3 py-2">
      <p className="text-[11px] text-ink-faint">{label}</p>
      <p className="font-mono text-sm font-semibold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

export function AnalyticsPage() {
  const { connected } = useRealtimeDashboard();
  const [rangeHours, setRangeHours] = useState(24);
  const { data } = useHistory(rangeHours);
  const [statistics, setStatistics] = useState<AnalyticsStatistics | null>(null);

  useEffect(() => {
    fetchStatistics().then(setStatistics).catch(() => undefined);
    const id = setInterval(() => fetchStatistics().then(setStatistics).catch(() => undefined), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <AppShell title="Analytics" connected={connected}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-muted">
            Historical readings are snapshotted hourly, so trends build up over the unit's runtime.
          </p>
          <div className="flex gap-1 rounded-lg border border-base-border bg-surface p-1">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option.hours}
                onClick={() => setRangeHours(option.hours)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  rangeHours === option.hours
                    ? "bg-water/15 text-water"
                    : "text-ink-faint hover:text-ink-primary"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {statistics && (
          <GlassCard className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <StatRow title="Daily Average" values={statistics.dailyAverage} />
            <StatRow title="Weekly Average" values={statistics.weeklyAverage} />
          </GlassCard>
        )}

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <GlassCard>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-ink-faint">
              Temperature History
            </p>
            <HistoryChart data={data} dataKey="temperature" color="#F2554C" unit="°C" />
          </GlassCard>
          <GlassCard>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-ink-faint">
              Humidity History
            </p>
            <HistoryChart data={data} dataKey="humidity" color="#2DD4BF" unit="%" />
          </GlassCard>
          <GlassCard>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-ink-faint">
              Water Level History
            </p>
            <HistoryChart data={data} dataKey="waterLevel" color="#38BDF8" unit="%" />
          </GlassCard>
          <GlassCard>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-ink-faint">
              Solar Production History
            </p>
            <HistoryChart data={data} dataKey="solarPower" color="#F5A623" unit="kW" />
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}
