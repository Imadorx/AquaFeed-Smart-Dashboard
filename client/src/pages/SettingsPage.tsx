import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { AppShell } from "../components/layout/AppShell";
import { GlassCard } from "../components/ui/GlassCard";
import { Toggle } from "../components/ui/Toggle";
import { Button } from "../components/ui/Button";
import { fetchSettings, updateSettings } from "../services/api";
import { Settings } from "../types/domain";
import { useRealtimeDashboard } from "../hooks/useRealtimeDashboard";

function FieldSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-primary">{label}</span>
        <span className="font-mono text-sm text-water">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1.5 w-full appearance-none rounded-full bg-surface accent-water"
      />
    </div>
  );
}

export function SettingsPage() {
  const { connected } = useRealtimeDashboard();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    fetchSettings().then(setSettings);
  }, []);

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await updateSettings(settings);
      setSettings(updated);
      setSavedAt(new Date());
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell title="Settings" connected={connected}>
      {!settings ? (
        <div className="flex h-full items-center justify-center text-sm text-ink-faint">Loading settings...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <GlassCard className="flex flex-col gap-6">
            <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">Thresholds</p>
            <FieldSlider
              label="Temperature Threshold"
              value={settings.temperatureThreshold}
              min={15}
              max={40}
              step={0.5}
              unit="°C"
              onChange={(value) => setSettings({ ...settings, temperatureThreshold: value })}
            />
            <FieldSlider
              label="Humidity Threshold"
              value={settings.humidityThreshold}
              min={20}
              max={90}
              step={1}
              unit="%"
              onChange={(value) => setSettings({ ...settings, humidityThreshold: value })}
            />
            <FieldSlider
              label="Reminder Interval"
              value={settings.notificationIntervalHours}
              min={1}
              max={12}
              step={1}
              unit="h"
              onChange={(value) => setSettings({ ...settings, notificationIntervalHours: value })}
            />
          </GlassCard>

          <GlassCard className="flex flex-col gap-6">
            <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">Automation</p>
            <div className="flex items-center justify-between rounded-xl border border-base-border bg-surface px-4 py-3">
              <div>
                <p className="text-sm text-ink-primary">Automation Enabled</p>
                <p className="text-xs text-ink-faint">
                  Let the system drive the pump and cooling based on thresholds above.
                </p>
              </div>
              <Toggle
                checked={settings.automationEnabled}
                onChange={(value) => setSettings({ ...settings, automationEnabled: value })}
              />
            </div>

            <div className="mt-auto flex items-center justify-between">
              <p className="text-xs text-ink-faint">
                {savedAt ? `Saved at ${savedAt.toLocaleTimeString(undefined, { hour12: false })}` : ""}
              </p>
              <Button variant="primary" onClick={handleSave} disabled={saving}>
                <Save size={14} />
                {saving ? "Saving..." : "Save to MongoDB"}
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </AppShell>
  );
}
