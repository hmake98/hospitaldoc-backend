/*
  Warnings:

  - You are about to drop the `Hospital` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_hospitalId_fkey";

-- DropForeignKey
ALTER TABLE "Hospital" DROP CONSTRAINT "Hospital_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "subAdminId" INTEGER;

-- DropTable
DROP TABLE "Hospital";

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
