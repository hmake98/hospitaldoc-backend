/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Hospital` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Hospital_userId_key" ON "Hospital"("userId");
