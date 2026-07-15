import { Server, Socket } from "socket.io";
import { prisma } from "../config/prisma";
import passengerTimerHandler from "./passengerTimer";

export default function interactionHandler(socket: Socket, io: Server) {
  // Passenger: Extend Timer
  socket.on("extendTimer", async (data: { userId: string }) => {
    const { userId } = data;
    console.log(`⏳ Extend request for ${userId}`);

    const record = await prisma.coordinates.findUnique({ where: { userId } });
    if (!record) return;

    // Limit check: allow only 3 extensions
    if (record.extensionCount >= 3) {
      socket.emit("error", { message: "Max extension limit reached" });
      return;
    }

    const updatedRecord = await prisma.coordinates.update({
      where: { userId },
      data: {
        duration: record.duration + 10 * 60 * 1000,
        extensionCount: record.extensionCount + 1,
      },
    });

    await passengerTimerHandler(io, userId);
    socket.emit("timerExtended", { newDuration: updatedRecord.duration });
  });

  // Driver: Mark Passenger
  socket.on(
    "markPassenger",
    async (data: { passengerId: string; driverId: string }) => {
      const { passengerId, driverId } = data;
      console.log(`🚕 Driver ${driverId} marking passenger ${passengerId}`);

      const record = await prisma.coordinates.findUnique({
        where: { userId: passengerId },
      });
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

      await prisma.coordinates.update({
        where: { userId: passengerId },
        data: {
          markedBy: driverId,
          markedAt: new Date(),
          duration: Math.max(record.duration, 30 * 60 * 1000),
        },
      });

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

      const record = await prisma.coordinates.findUnique({
        where: { userId: passengerId },
      });
      if (!record) return;

      if (record.markedBy !== driverId) return; // Can't unmark others

      await prisma.coordinates.update({
        where: { userId: passengerId },
        data: {
          markedBy: null,
          duration: 15 * 60 * 1000, // Reset to 15 minutes
        },
      });

      await passengerTimerHandler(io, passengerId);

      io.to(passengerId).emit("driverUnmarked");
      io.emit("passengerUnmarked", { passengerId });
    }
  );
}
