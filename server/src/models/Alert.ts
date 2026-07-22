import { Schema, model, Document, Types } from "mongoose";
import { AlertSeverity, AlertType } from "../types/domain";

export interface AlertAttributes {
  _id: Types.ObjectId;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  resolved: boolean;
  createdAt: Date;
  resolvedAt?: Date;
}

export type AlertDocument = Document & AlertAttributes;

const AlertSchema = new Schema<AlertDocument>(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "HIGH_TEMPERATURE",
        "LOW_WATER",
        "PUMP_FAILURE",
        "COOLING_FAILURE",
        "HUMIDITY_TOO_LOW",
        "IRRIGATION_REMINDER",
      ],
    },
    severity: { type: String, required: true, enum: ["info", "warning", "critical"] },
    message: { type: String, required: true },
    resolved: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, required: true, default: Date.now, index: true },
    resolvedAt: { type: Date },
  },
  { versionKey: false }
);

export const AlertModel = model<AlertDocument>("Alert", AlertSchema);
