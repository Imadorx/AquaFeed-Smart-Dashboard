import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "./apiClient";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(API_BASE_URL, {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
    });
  }
  return socket;
}
