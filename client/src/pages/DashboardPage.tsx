import { useEffect, useState } from "react";
import { Thermometer, Droplets, Waves, Sun, Fan, Recycle } from "lucide-react";
import { AppShell } from "../components/layout/AppShell";
import { useRealtimeDashboard } from "../hooks/useRealtimeDashboard";
import { SensorCard } from "../components/dashboard/SensorCard";
import { ActuatorCard } from "../components/dashboard/ActuatorCard";
import { SystemHealthCard } from "../components/dashboard/SystemHealthCard";
import { IrrigationReminderCard } from "../components/dashboard/IrrigationReminderCard";
import { PumpControlCard } from "../components/dashboard/PumpControlCard";
import { fetchSettings } from "../services/api";

export function DashboardPage() {
  const { snapshot, connected, error } = useRealtimeDashboard();
  const [automationEnabled, setAutomationEnabled] = useState(true);

  useEffect(() => {
    fetchSettings()
      .then((settings) => setAutomationEnabled(settings.automationEnabled))
      .catch(() => undefined);
  }, [snapshot?.current.timestamp]);

  const reading = snapshot?.current;

  return (
    <AppShell title="Farm Overview" connected={connected}>
      {!reading ? (
        <div className="flex h-full items-center justify-center text-sm text-ink-faint">
          {error ?? "Connecting to the sensor grid..."}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SensorCard
              label="Temperature"
              value={reading.temperature}
              unit="°C"
              icon={Thermometer}
              accent="#F2554C"
              helper="Grow chamber ambient temperature"
            />
            <SensorCard
              label="Humidity"
              value={reading.humidity}
              unit="%"
              icon={Droplets}
              accent="#2DD4BF"
              helper="Relative humidity around the canopy"
            />
            <SensorCard
              label="Water Tank"
              value={reading.waterLevel}
              unit="%"
              icon={Waves}
              accent="#38BDF8"
              helper="Reservoir fill level"
            />
            <SensorCard
              label="Solar Power"
              value={reading.solarPower}
              unit="kW"
              icon={Sun}
              accent="#F5A623"
              precision={2}
              helper="Live array output"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <ActuatorCard
              label="Irrigation Pump"
              active={reading.pumpStatus}
              icon={Droplets}
              accent="#2DD4BF"
              activeLabel="Running"
              idleLabel="Idle"
            />
            <ActuatorCard
              label="Cooling System"
              active={reading.coolingStatus}
              icon={Fan}
              accent="#38BDF8"
              activeLabel="Active"
              idleLabel="Standby"
            />
            <ActuatorCard
              label="Water Recycling"
              active={reading.waterRecycle}
              icon={Recycle}
              accent="#7CD46B"
              activeLabel="Recycling"
              idleLabel="Standby"
            />
            <SystemHealthCard status={snapshot.systemHealth} activeAlerts={snapshot.activeAlerts} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <IrrigationReminderCard nextIrrigationInMs={snapshot.nextIrrigationInMs} />
            <PumpControlCard automationEnabled={automationEnabled} />
          </div>
        </div>
      )}
    </AppShell>
  );
}
