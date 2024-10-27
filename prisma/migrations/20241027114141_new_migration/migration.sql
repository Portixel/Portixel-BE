/*
  Warnings:

  - You are about to drop the column `figmaIntegrationId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `FigmaIntegration` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_figmaIntegrationId_fkey";

-- AlterTable
ALTER TABLE "FigmaIntegration" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "figmaIntegrationId";

-- CreateIndex
CREATE UNIQUE INDEX "FigmaIntegration_userId_key" ON "FigmaIntegration"("userId");

-- AddForeignKey
ALTER TABLE "FigmaIntegration" ADD CONSTRAINT "FigmaIntegration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
