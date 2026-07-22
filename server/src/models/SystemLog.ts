import { Schema, model, Document, Types } from "mongoose";

export interface SystemLogAttributes {
  _id: Types.ObjectId;
  action: string;
  reason: string;
  createdAt: Date;
}

export type SystemLogDocument = Document & SystemLogAttributes;

const SystemLogSchema = new Schema<SystemLogDocument>(
  {
    action: { type: String, required: true },
    reason: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, index: true },
  },
  { versionKey: false }
);

export const SystemLogModel = model<SystemLogDocument>("SystemLog", SystemLogSchema);
