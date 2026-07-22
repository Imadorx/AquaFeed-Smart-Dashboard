export function formatDuration(ms: number): string {
  if (ms <= 0) return "due now";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export function formatDateTime(date: Date): { date: string; time: string } {
  return {
    date: date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
    time: date.toLocaleTimeString(undefined, { hour12: false }),
  };
}

export function formatChartTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export const ALERT_TYPE_LABELS: Record<string, string> = {
  HIGH_TEMPERATURE: "High temperature",
  LOW_WATER: "Low water level",
  PUMP_FAILURE: "Pump failure",
  COOLING_FAILURE: "Cooling failure",
  HUMIDITY_TOO_LOW: "Humidity too low",
  IRRIGATION_REMINDER: "Irrigation reminder",
};
