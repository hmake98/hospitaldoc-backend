/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "agreementDuration" INTEGER,
ADD COLUMN     "billingAddress" TEXT,
ADD COLUMN     "clientName" TEXT,
ADD COLUMN     "emergencyContactName" TEXT,
ADD COLUMN     "emergencyContactNumber" TEXT,
ADD COLUMN     "gst" TEXT,
ADD COLUMN     "legalName" TEXT,
ADD COLUMN     "panCard" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");
