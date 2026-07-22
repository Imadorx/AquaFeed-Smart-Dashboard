import { Schema, model, Document, Types } from "mongoose";

export interface SensorDataAttributes {
  _id: Types.ObjectId;
  temperature: number;
  humidity: number;
  waterLevel: number;
  solarPower: number;
  pumpStatus: boolean;
  coolingStatus: boolean;
  waterRecycle: boolean;
  timestamp: Date;
}

export type SensorDataDocument = Document & SensorDataAttributes;

const SensorDataSchema = new Schema<SensorDataDocument>(
  {
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    waterLevel: { type: Number, required: true },
    solarPower: { type: Number, required: true },
    pumpStatus: { type: Boolean, required: true, default: false },
    coolingStatus: { type: Boolean, required: true, default: false },
    waterRecycle: { type: Boolean, required: true, default: false },
    timestamp: { type: Date, required: true, default: Date.now, index: true },
  },
  { versionKey: false }
);

export const SensorDataModel = model<SensorDataDocument>("SensorData", SensorDataSchema);
