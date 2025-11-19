import { Socket } from "socket.io";
import Coordinates from "../models/Coordinates";

export async function deleteCoordinatesByUserId(userId: string) {
  return Coordinates.findOneAndDelete({ userId });
}

const FIFTEEN_MIN = 15 * 60 * 1000;
const UPDATE_INTERVALS = [
  5 * 60 * 1000,    // After 5 min → 10 min left
  10 * 60 * 1000,   // After 10 min → 5 min left
  14 * 60 * 1000,   // After 14 min → 1 min left
  15 * 60 * 1000    // After 15 min → timer ended + delete
];

interface TimeoutMap {
  [userId: string]: NodeJS.Timeout[];
}

const userTimeouts: TimeoutMap = {};

export default async function passengerTimerHandler(socket: Socket, userId: string) {
  console.log(`🚕 Setting up timer handler for user ${userId}`);
  if (!userId) return;

  console.log(`⏳ Loading timer for passenger ${userId}`);

  // Clear old timeouts if user reconnects
  if (userTimeouts[userId]) {
    userTimeouts[userId].forEach((t) => clearTimeout(t));
    delete userTimeouts[userId];
  }

  const record = await Coordinates.findOne({ userId });
  if (!record) {
    console.error(`⚠️ No coordinate found for user ${userId}`);
    return;
  }

  if (!record.startTimer) {
    record.startTimer = new Date();
    await record.save();
    console.log(`🆕 New timer started for ${userId}`);
  } else {
    console.log(`🔁 Resuming timer for ${userId}`);
  }

  const startTime = record.startTimer.getTime();
  const now = Date.now();
  const elapsed = now - startTime;
  const remaining = Math.max(FIFTEEN_MIN - elapsed, 0);

  // Emit initial remaining time
  console.log(`⏲️ Remaining time for ${userId}: ${remaining} ms`);
  socket.emit("remainingTime", { remainingMs: remaining });

  // If already expired, delete immediately
  if (remaining <= 0) {
    console.log(`⛔ Timer ended for ${userId}`);
    try {
      await deleteCoordinatesByUserId(userId);
      console.log(`✅ Coordinates deleted for ${userId}`);
    } catch (err) {
      console.error(`⚠️ Failed to delete coordinates for ${userId}`, err);
    }
    socket.emit("timerEnded");
    return;
  }

  const timeouts: NodeJS.Timeout[] = [];

  // Schedule updates dynamically
  UPDATE_INTERVALS.forEach((t) => {
    const delay = t - elapsed;
    if (delay > 0 && delay < FIFTEEN_MIN) {
      const timeout = setTimeout(() => {
        const newRemaining = Math.max(FIFTEEN_MIN - (Date.now() - startTime), 0);
        socket.emit("remainingTime", { remainingMs: newRemaining });
      }, delay);
      timeouts.push(timeout);
    }
  });

  // Schedule final deletion at timer end
  const finalDelay = FIFTEEN_MIN - elapsed;
  const finalTimeout = setTimeout(async () => {
    socket.emit("remainingTime", { remainingMs: 0 });
    socket.emit("timerEnded");
    try {
      await deleteCoordinatesByUserId(userId);
      console.log(`✅ Coordinates deleted for ${userId}`);
    } catch (err) {
      console.error(`⚠️ Failed to delete coordinates for ${userId}`, err);
    }
  }, finalDelay);

  timeouts.push(finalTimeout);
  userTimeouts[userId] = timeouts;

  // Clear timeouts on disconnect
  socket.on("disconnect", () => {
    console.log(`❌ Socket disconnected for user ${userId}`);
    if (userTimeouts[userId]) {
      userTimeouts[userId].forEach((t) => clearTimeout(t));
      delete userTimeouts[userId];
    }
  });
}
