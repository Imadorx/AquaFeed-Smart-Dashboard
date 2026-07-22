import { settingsRepository, UpdateSettingsInput } from "../repositories/settings.repository";
import { SettingsDocument } from "../models/Settings";

export class SettingsService {
  async getSettings(): Promise<SettingsDocument> {
    return settingsRepository.getOrCreate();
  }

  async updateSettings(input: UpdateSettingsInput): Promise<SettingsDocument> {
    this.validate(input);
    return settingsRepository.update(input);
  }

  private validate(input: UpdateSettingsInput): void {
    if (
      input.temperatureThreshold !== undefined &&
      (input.temperatureThreshold < 10 || input.temperatureThreshold > 45)
    ) {
      throw new Error("temperatureThreshold must be between 10 and 45");
    }
    if (
      input.humidityThreshold !== undefined &&
      (input.humidityThreshold < 10 || input.humidityThreshold > 95)
    ) {
      throw new Error("humidityThreshold must be between 10 and 95");
    }
    if (
      input.notificationIntervalHours !== undefined &&
      (input.notificationIntervalHours < 1 || input.notificationIntervalHours > 24)
    ) {
      throw new Error("notificationIntervalHours must be between 1 and 24");
    }
  }
}

export const settingsService = new SettingsService();
