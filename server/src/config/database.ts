import mongoose from "mongoose";
import { env } from "./env";

mongoose.set("strictQuery", true);

const CONNECTION_OPTIONS = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 20000,
  heartbeatFrequencyMS: 10000,
  maxPoolSize: 10,
  retryWrites: true,
};

export async function connectDatabase(): Promise<void> {
  mongoose.connection.on("connected", () => {
    console.log("[database] connected to MongoDB");
  });

  // Registering this listener is required: without it, a connection-level
  // error becomes an unhandled "error" event on the Connection EventEmitter,
  // which crashes the whole Node process instead of just logging.
  mongoose.connection.on("error", (error) => {
    console.error("[database] connection error:", error.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("[database] disconnected from MongoDB, driver will retry automatically");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("[database] reconnected to MongoDB");
  });

  await mongoose.connect(env.mongoUri, CONNECTION_OPTIONS);
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
