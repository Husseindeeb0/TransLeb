-- CreateEnum
CREATE TYPE "Role" AS ENUM ('driver', 'passenger', 'admin');

-- CreateEnum
CREATE TYPE "FormState" AS ENUM ('open', 'planning', 'scheduled', 'archived');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'passenger',
    "refreshToken" TEXT,
    "phoneNumber" TEXT,
    "region" TEXT,
    "description" TEXT,
    "profileImage" TEXT,
    "profileImageId" TEXT,
    "coverImage" TEXT,
    "coverImageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "subscriptionStart" TIMESTAMP(3),
    "subscriptionEnd" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coordinates" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "dayCardId" TEXT,
    "startTimer" TIMESTAMP(3),
    "markedBy" TEXT,
    "markedAt" TIMESTAMP(3),
    "extensionCount" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 900000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coordinates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DayCard" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "formState" "FormState" NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DayCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusTimer" (
    "id" TEXT NOT NULL,
    "dayCardId" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "BusTimer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PassengerForm" (
    "id" TEXT NOT NULL,
    "dayCardId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "livingPlace" TEXT NOT NULL,
    "desiredTime" TEXT NOT NULL,
    "passengerCount" INTEGER NOT NULL DEFAULT 1,
    "assignedBusTime" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PassengerForm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Coordinates_userId_key" ON "Coordinates"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DayCard_driverId_date_key" ON "DayCard"("driverId", "date");

-- CreateIndex
CREATE INDEX "PassengerForm_dayCardId_desiredTime_idx" ON "PassengerForm"("dayCardId", "desiredTime");

-- CreateIndex
CREATE INDEX "PassengerForm_livingPlace_idx" ON "PassengerForm"("livingPlace");

-- AddForeignKey
ALTER TABLE "Coordinates" ADD CONSTRAINT "Coordinates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coordinates" ADD CONSTRAINT "Coordinates_dayCardId_fkey" FOREIGN KEY ("dayCardId") REFERENCES "DayCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DayCard" ADD CONSTRAINT "DayCard_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusTimer" ADD CONSTRAINT "BusTimer_dayCardId_fkey" FOREIGN KEY ("dayCardId") REFERENCES "DayCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PassengerForm" ADD CONSTRAINT "PassengerForm_dayCardId_fkey" FOREIGN KEY ("dayCardId") REFERENCES "DayCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PassengerForm" ADD CONSTRAINT "PassengerForm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
