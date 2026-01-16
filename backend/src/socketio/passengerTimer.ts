import { Server } from "socket.io";
import Coordinates from "../models/Coordinates";

export async function deleteCoordinatesByUserId(userId: string) {
  return Coordinates.findOneAndDelete({ userId });
}

interface TimeoutMap {
  [userId: string]: NodeJS.Timeout[];
}

const userTimeouts: TimeoutMap = {};

export default async function passengerTimerHandler(
  io: Server,
  userId: string
) {
  console.log(`🚕 Setting up timer handler for user ${userId}`);
  if (!userId) return;

  console.log(`⏳ Loading timer for passenger ${userId}`);

  // Clear old timeouts/intervals if logic is re-run (e.g. on extension)
  if (userTimeouts[userId]) {
    userTimeouts[userId].forEach((t) => {
      clearTimeout(t as NodeJS.Timeout);
      clearInterval(t as unknown as NodeJS.Timeout);
    });
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

  const duration = record.duration || 15 * 60 * 1000;
  const startTime = record.startTimer.getTime();
  const now = Date.now();
  const elapsed = now - startTime;
  const remaining = Math.max(duration - elapsed, 0);

  // Emit initial remaining time
  console.log(`⏲️ Remaining time for ${userId}: ${remaining} ms`);
  io.to(userId).emit("remainingTime", { remainingMs: remaining });

  // If already expired, delete immediately
  if (remaining <= 0) {
    console.log(`⛔ Timer ended for ${userId}`);
    try {
      await deleteCoordinatesByUserId(userId);
      console.log(`✅ Coordinates deleted for ${userId}`);
    } catch (err) {
      console.error(`⚠️ Failed to delete coordinates for ${userId}`, err);
    }
    io.to(userId).emit("timerEnded");
    return;
  }

  // Initialize storage for this user
  userTimeouts[userId] = [];

  // 1. Set a Final Timeout for the exact end time
  const finalTimeout = setTimeout(async () => {
    io.to(userId).emit("remainingTime", { remainingMs: 0 });
    io.to(userId).emit("timerEnded");
    try {
      await deleteCoordinatesByUserId(userId);
      console.log(`✅ Coordinates deleted for ${userId}`);
    } catch (err) {
      console.error(`⚠️ Failed to delete coordinates for ${userId}`, err);
    }
  }, remaining);
  userTimeouts[userId].push(finalTimeout);

  // 2. Recursive Loop for Updates
  // Strategy:
  // - > 1 min left: update every 5 mins (or wait until exactly 1 min left)
  // - <= 1 min left: update every 10 seconds
  const scheduleNextUpdate = () => {
    const currentElapsed = Date.now() - startTime;
    const currentRemaining = Math.max(duration - currentElapsed, 0);

    // Stop if finished (handled by finalTimeout)
    if (currentRemaining <= 0) return;

    // Send update
    io.to(userId).emit("remainingTime", { remainingMs: currentRemaining });

    let nextDelay = 10000; // Default 10s

    if (currentRemaining > 60000) {
      const timeToOneMinute = currentRemaining - 60000;
      // If we have more than 5 mins to go before the 1-minute mark, wait 5 mins
      if (timeToOneMinute > 5 * 60 * 1000) {
        nextDelay = 5 * 60 * 1000;
      } else {
        // Otherwise wait exactly until the 1-minute mark
        nextDelay = timeToOneMinute;
      }
    } else {
      // Last minute: 10s updates
      nextDelay = 10000;
    }

    // Schedule next
    const loopTimeout = setTimeout(scheduleNextUpdate, nextDelay);

    // Update the stored timeout reference so we can clear it if needed
    if (userTimeouts[userId]) {
      userTimeouts[userId].push(loopTimeout);
    }
  };

  // Start the loop
  // Calculate first delay based on current remaining
  let firstDelay = 10000;
  if (remaining > 60000) {
    const timeToOneMinute = remaining - 60000;
    if (timeToOneMinute > 5 * 60 * 1000) {
      firstDelay = 5 * 60 * 1000;
    } else {
      firstDelay = timeToOneMinute;
    }
  }

  const initialLoopTimeout = setTimeout(scheduleNextUpdate, firstDelay);
  userTimeouts[userId].push(initialLoopTimeout);
}
