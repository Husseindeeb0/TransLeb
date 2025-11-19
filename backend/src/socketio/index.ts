import { io } from "../config/socketio";
import passengerTimerHandler from "./passengerTimer";

export default function socketRouter() {
  io.on("connection", (socket) => {
    console.log("🔌 New client:", socket.id);
    const userId = socket.handshake.query.userId as string;

    // Attach this user's handlers
    console.log(`🛠️ Attaching handlers for user ${userId}`);
    passengerTimerHandler(socket, userId);

    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id);
    });
  });
}
