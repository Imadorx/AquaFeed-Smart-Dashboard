import { Server as SocketIOServer } from "socket.io";
import { SimulationEngine } from "../services/simulation.engine";
import { automationService } from "../services/automation.service";
import { reminderService } from "../services/reminder.service";
import { settingsService } from "../services/settings.service";
import { sensorDataRepository } from "../repositories/sensorData.repository";
import { alertRepository } from "../repositories/alert.repository";
import { systemHealthService } from "../services/systemHealth.service";
import { dashboardService } from "../services/dashboard.service";
import { env } from "../config/env";
import { SensorReading } from "../types/domain";

class SimulationRuntime {
  private engine = new SimulationEngine();
  private io: SocketIOServer | null = null;
  private tickTimer: NodeJS.Timeout | null = null;
  private snapshotTimer: NodeJS.Timeout | null = null;
  private latestReading: SensorReading | null = null;
  private manualOverrideUntilTick = 0;
  private tickCount = 0;

  attachSocketServer(io: SocketIOServer): void {
    this.io = io;
  }

  getLatestReading(): SensorReading | null {
    return this.latestReading;
  }

  async requestPumpOverride(pumpOn: boolean): Promise<{ ok: boolean; reason?: string }> {
    const settings = await settingsService.getSettings();
    if (settings.automationEnabled) {
      return {
        ok: false,
        reason:
          "Automation is enabled and controls the pump automatically. Disable automation in Settings to take manual control.",
      };
    }
    this.engine.setActuators({ pumpStatus: pumpOn });
    return { ok: true };
  }

  async start(): Promise<void> {
    const settings = await settingsService.getSettings();
    reminderService.setIntervalHours(settings.notificationIntervalHours);

    this.tickTimer = setInterval(() => {
      this.tick().catch((error) => {
        console.error("[simulation] tick failed:", error);
      });
    }, env.simulationTickMs);

    this.snapshotTimer = setInterval(() => {
      this.persistSnapshot().catch((error) => {
        console.error("[simulation] snapshot persistence failed:", error);
      });
    }, env.snapshotIntervalMs);
  }

  stop(): void {
    if (this.tickTimer) clearInterval(this.tickTimer);
    if (this.snapshotTimer) clearInterval(this.snapshotTimer);
  }

  private async tick(): Promise<void> {
    this.tickCount += 1;
    const settings = await settingsService.getSettings();
    const rawReading = this.engine.tick(env.simulationTickMs);

    const decision = await automationService.evaluate(rawReading, settings);
    this.engine.setActuators(decision);

    const reading: SensorReading = {
      ...rawReading,
      pumpStatus: decision.pumpStatus,
      coolingStatus: decision.coolingStatus,
    };
    this.latestReading = reading;

    await reminderService.checkAndTrigger();

    const snapshot = await dashboardService.buildSnapshot(reading);

    if (this.io) {
      this.io.emit("dashboard:update", snapshot);
    }
  }

  private async persistSnapshot(): Promise<void> {
    if (!this.latestReading) return;
    await sensorDataRepository.insertSnapshot(this.latestReading);
  }
}

export const simulationRuntime = new SimulationRuntime();
