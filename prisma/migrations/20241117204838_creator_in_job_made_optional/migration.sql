-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_creatorId_fkey";

-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "creatorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
