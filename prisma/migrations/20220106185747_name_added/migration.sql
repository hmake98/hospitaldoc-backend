/*
  Warnings:

  - Added the required column `name` to the `Hospital` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hospital" ADD COLUMN     "name" TEXT NOT NULL;
