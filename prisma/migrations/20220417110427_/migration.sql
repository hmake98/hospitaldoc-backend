-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "viewCount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT E'ADMIN';
