import { Server } from "socket.io";
import http from "http";

export let io: Server;

export function initSocket(server: http.Server) {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "https://transleb.onrender.com"],
      credentials: true,
    },
  });

  return io;
}
