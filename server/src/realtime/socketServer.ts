import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { env } from "../config/env";
import { simulationRuntime } from "./simulationRuntime";
import { dashboardService } from "../services/dashboard.service";

export function createSocketServer(httpServer: HTTPServer): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.clientOrigin,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`[socket] client connected: ${socket.id}`);

    void (async () => {
      const latest = simulationRuntime.getLatestReading();
      if (latest) {
        const snapshot = await dashboardService.buildSnapshot(latest);
        socket.emit("dashboard:update", snapshot);
      }
    })();

    socket.on("disconnect", () => {
      console.log(`[socket] client disconnected: ${socket.id}`);
    });
  });

  simulationRuntime.attachSocketServer(io);

  return io;
}
