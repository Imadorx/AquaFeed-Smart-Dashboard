import { Schema, model, Document } from "mongoose";

export interface SettingsDocument extends Document {
  temperatureThreshold: number;
  humidityThreshold: number;
  automationEnabled: boolean;
  notificationIntervalHours: number;
  updatedAt: Date;
}

const SettingsSchema = new Schema<SettingsDocument>(
  {
    temperatureThreshold: { type: Number, required: true, default: 30 },
    humidityThreshold: { type: Number, required: true, default: 55 },
    automationEnabled: { type: Boolean, required: true, default: true },
    notificationIntervalHours: { type: Number, required: true, default: 4 },
    updatedAt: { type: Date, required: true, default: Date.now },
  },
  { versionKey: false }
);

export const SettingsModel = model<SettingsDocument>("Settings", SettingsSchema);
