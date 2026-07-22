import dotenv from "dotenv";

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(required("PORT", "4000")),
  mongoUri: required("MONGODB_URI", "mongodb://127.0.0.1:27017/aquafeed"),
  clientOrigin: required("CLIENT_ORIGIN", "http://localhost:5173"),
  simulationTickMs: Number(required("SIMULATION_TICK_MS", "1000")),
  snapshotIntervalMs: Number(required("SNAPSHOT_INTERVAL_MS", "3600000")),
  reminderIntervalHours: Number(required("REMINDER_INTERVAL_HOURS", "4")),
};
