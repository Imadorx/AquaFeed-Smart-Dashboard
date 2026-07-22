// import { createServer } from "http";
// import { createApp } from "./app";
// import { env } from "./config/env";
// import { connectDatabase } from "./config/database";
// import { createSocketServer } from "./realtime/socketServer";
// import { simulationRuntime } from "./realtime/simulationRuntime";

// async function bootstrap(): Promise<void> {
//   await connectDatabase();

//   const app = createApp();
//   const httpServer = createServer(app);

//   createSocketServer(httpServer);
//   await simulationRuntime.start();

//   httpServer.listen(env.port, () => {
//     console.log(`[server] AquaFeed API listening on port ${env.port}`);
//   });

//   const shutdown = async (signal: string): Promise<void> => {
//     console.log(`[server] received ${signal}, shutting down gracefully`);
//     simulationRuntime.stop();
//     httpServer.close();
//     process.exit(0);
//   };

//   process.on("SIGINT", () => void shutdown("SIGINT"));
//   process.on("SIGTERM", () => void shutdown("SIGTERM"));
// }

// bootstrap().catch((error) => {
//   console.error("[server] fatal startup error:", error);
//   process.exit(1);
// });

import { createServer } from "http";
import { createApp } from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";
import { createSocketServer } from "./realtime/socketServer";
import { simulationRuntime } from "./realtime/simulationRuntime";

// A flaky network (WiFi drops, VPN, Atlas throttling) can make the MongoDB
// driver throw errors from deep inside its internal connection pool that no
// try/catch in our own code can reach. Left unhandled, Node treats these as
// fatal and kills the whole process — which is what stopped the server.
// These two guards make that class of transient error non-fatal: it gets
// logged, the driver keeps retrying in the background, and the API/socket
// server stays up.
process.on("uncaughtException", (error) => {
  console.error("[server] uncaught exception (process kept alive):", error);
});

process.on("unhandledRejection", (reason) => {
  console.error("[server] unhandled promise rejection (process kept alive):", reason);
});

async function bootstrap(): Promise<void> {
  await connectDatabase();

  const app = createApp();
  const httpServer = createServer(app);

  createSocketServer(httpServer);
  await simulationRuntime.start();

  httpServer.listen(env.port, () => {
    console.log(`[server] AquaFeed API listening on port ${env.port}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`[server] received ${signal}, shutting down gracefully`);
    simulationRuntime.stop();
    httpServer.close();
    process.exit(0);
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

bootstrap().catch((error) => {
  console.error("[server] fatal startup error:", error);
  process.exit(1);
});
