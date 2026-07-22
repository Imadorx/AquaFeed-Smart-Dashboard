import { alertRepository } from "../repositories/alert.repository";
import { systemLogRepository } from "../repositories/systemLog.repository";
import { SensorReading } from "../types/domain";
import { SettingsDocument } from "../models/Settings";

const LOW_WATER_THRESHOLD = 20;
const PUMP_FAILURE_HUMIDITY_MARGIN = 5;
const COOLING_FAILURE_TEMPERATURE_MARGIN = 4;

export interface AutomationDecision {
  pumpStatus: boolean;
  coolingStatus: boolean;
}

export class AutomationService {
  private previousPumpStatus = false;
  private previousCoolingStatus = false;
  private pumpBelowThresholdTicks = 0;
  private coolingAboveThresholdTicks = 0;

  async evaluate(
    reading: SensorReading,
    settings: SettingsDocument
  ): Promise<AutomationDecision> {
    if (!settings.automationEnabled) {
      return { pumpStatus: reading.pumpStatus, coolingStatus: reading.coolingStatus };
    }

    const pumpStatus = reading.humidity < settings.humidityThreshold;
    const coolingStatus = reading.temperature > settings.temperatureThreshold;

    if (pumpStatus !== this.previousPumpStatus) {
      await systemLogRepository.record(
        pumpStatus ? "PUMP_ON" : "PUMP_OFF",
        pumpStatus
          ? `Humidity ${reading.humidity.toFixed(1)}% fell below threshold ${settings.humidityThreshold}%`
          : `Humidity ${reading.humidity.toFixed(1)}% recovered above threshold ${settings.humidityThreshold}%`
      );
      this.previousPumpStatus = pumpStatus;
    }

    if (coolingStatus !== this.previousCoolingStatus) {
      await systemLogRepository.record(
        coolingStatus ? "COOLING_ON" : "COOLING_OFF",
        coolingStatus
          ? `Temperature ${reading.temperature.toFixed(1)}°C exceeded threshold ${settings.temperatureThreshold}°C`
          : `Temperature ${reading.temperature.toFixed(1)}°C recovered below threshold ${settings.temperatureThreshold}°C`
      );
      this.previousCoolingStatus = coolingStatus;
    }

    await this.evaluateAlerts(reading, settings, pumpStatus, coolingStatus);

    return { pumpStatus, coolingStatus };
  }

  private async evaluateAlerts(
    reading: SensorReading,
    settings: SettingsDocument,
    pumpStatus: boolean,
    coolingStatus: boolean
  ): Promise<void> {
    await this.syncAlert(
      "HIGH_TEMPERATURE",
      reading.temperature > settings.temperatureThreshold + 2,
      "critical",
      `Temperature reached ${reading.temperature.toFixed(1)}°C, above the safe threshold of ${settings.temperatureThreshold}°C.`
    );

    await this.syncAlert(
      "LOW_WATER",
      reading.waterLevel < LOW_WATER_THRESHOLD,
      "critical",
      `Water tank level dropped to ${reading.waterLevel.toFixed(1)}%.`
    );

    await this.syncAlert(
      "HUMIDITY_TOO_LOW",
      reading.humidity < settings.humidityThreshold - 10,
      "warning",
      `Humidity dropped to ${reading.humidity.toFixed(1)}%, well below the ${settings.humidityThreshold}% target.`
    );

    if (pumpStatus) {
      this.pumpBelowThresholdTicks += 1;
    } else {
      this.pumpBelowThresholdTicks = 0;
    }
    await this.syncAlert(
      "PUMP_FAILURE",
      pumpStatus && reading.humidity < settings.humidityThreshold - PUMP_FAILURE_HUMIDITY_MARGIN && this.pumpBelowThresholdTicks > 120,
      "critical",
      "Irrigation pump is running but humidity is not recovering. Possible pump failure."
    );

    if (coolingStatus) {
      this.coolingAboveThresholdTicks += 1;
    } else {
      this.coolingAboveThresholdTicks = 0;
    }
    await this.syncAlert(
      "COOLING_FAILURE",
      coolingStatus && reading.temperature > settings.temperatureThreshold + COOLING_FAILURE_TEMPERATURE_MARGIN && this.coolingAboveThresholdTicks > 120,
      "critical",
      "Cooling system is active but temperature keeps rising. Possible cooling failure."
    );
  }

  private async syncAlert(
    type: Parameters<typeof alertRepository.findActiveByType>[0],
    shouldBeActive: boolean,
    severity: "info" | "warning" | "critical",
    message: string
  ): Promise<void> {
    const existing = await alertRepository.findActiveByType(type);
    if (shouldBeActive && !existing) {
      await alertRepository.create({ type, severity, message });
    } else if (!shouldBeActive && existing) {
      await alertRepository.resolve(String(existing._id));
    }
  }
}

export const automationService = new AutomationService();
