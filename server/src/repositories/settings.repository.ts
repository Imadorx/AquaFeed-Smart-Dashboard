import { SettingsModel, SettingsDocument } from "../models/Settings";

export interface UpdateSettingsInput {
  temperatureThreshold?: number;
  humidityThreshold?: number;
  automationEnabled?: boolean;
  notificationIntervalHours?: number;
}

const SETTINGS_SINGLETON_QUERY = {};

export class SettingsRepository {
  async getOrCreate(): Promise<SettingsDocument> {
    const existing = await SettingsModel.findOne(SETTINGS_SINGLETON_QUERY);
    if (existing) return existing;
    return SettingsModel.create({});
  }

  async update(input: UpdateSettingsInput): Promise<SettingsDocument> {
    const updated = await SettingsModel.findOneAndUpdate(
      SETTINGS_SINGLETON_QUERY,
      { ...input, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    return updated;
  }
}

export const settingsRepository = new SettingsRepository();
