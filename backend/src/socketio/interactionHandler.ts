import { Server, Socket } from "socket.io";
import Coordinates from "../models/Coordinates";
import passengerTimerHandler from "./passengerTimer";

export default function interactionHandler(socket: Socket, io: Server) {
  // Passenger: Extend Timer
  socket.on("extendTimer", async (data: { userId: string }) => {
    const { userId } = data;
    console.log(`⏳ Extend request for ${userId}`);
    const record = await Coordinates.findOne({ userId });
    if (!record) return;

    // Limit check? "Give passenger only limited number of times to extend time"
    if (record.extensionCount >= 3) {
      // Example limit: 3 times
      socket.emit("error", { message: "Max extension limit reached" });
      return;
    }

    record.duration += 10 * 60 * 1000;
    record.extensionCount += 1;
    await record.save();

    await passengerTimerHandler(io, userId);
    socket.emit("timerExtended", { newDuration: record.duration });
  });

  // Driver: Mark Passenger
  socket.on(
    "markPassenger",
    async (data: { passengerId: string; driverId: string }) => {
      const { passengerId, driverId } = data;
      console.log(`🚕 Driver ${driverId} marking passenger ${passengerId}`);

      // Race condition check: use findOneAndUpdate with condition
      const record = await Coordinates.findOne({ userId: passengerId });
      if (!record) {
        socket.emit("error", { message: "Passenger not found" });
        return;
      }

      if (record.markedBy && record.markedBy !== driverId) {
        socket.emit("error", {
          message: "Passenger already marked by another driver",
        });
        return;
      }

      // Update
      record.markedBy = driverId;
      // record.markedAt = new Date(); // If type issue, fix model or ignore
      // Set duration to 30 mins (total) if it was 15?
      // User: "extended to 30min"
      // Let's set duration to Math.max(record.duration, 30 * 60 * 1000)
      record.duration = Math.max(record.duration, 30 * 60 * 1000);

      await record.save();

      await passengerTimerHandler(io, passengerId);

      // Notify Passenger
      io.to(passengerId).emit("driverMarked", { driverId });

      // Notify all drivers (or just emit to everyone to refresh map)
      io.emit("passengerMarked", { passengerId, driverId });
    }
  );

  // Driver: Unmark Passenger
  socket.on(
    "unmarkPassenger",
    async (data: { passengerId: string; driverId: string }) => {
      const { passengerId, driverId } = data;

      const record = await Coordinates.findOne({ userId: passengerId });
      if (!record) return;

      if (record.markedBy !== driverId) return; // Can't unmark others

      record.markedBy = null; // Mongoose handles null if schema allows, or undefined
      // Reset duration? "return the passenger timer to 15minutes"
      // If it was extended by passenger, do we keep extension?
      // "return the passenger timer to 15minutes"
      record.duration = 15 * 60 * 1000;

      await record.save();

      await passengerTimerHandler(io, passengerId);

      io.to(passengerId).emit("driverUnmarked");
      io.emit("passengerUnmarked", { passengerId });
    }
  );
}
