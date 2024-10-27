/*
  Warnings:

  - You are about to drop the column `service` on the `Integration` table. All the data in the column will be lost.
  - Added the required column `type` to the `Integration` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "IntegrationType" AS ENUM ('FIGMA', 'GITHUB');

-- AlterTable
ALTER TABLE "Integration" DROP COLUMN "service",
ADD COLUMN     "type" "IntegrationType" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "figmaIntegrationId" INTEGER;

-- CreateTable
CREATE TABLE "FigmaIntegration" (
    "id" SERIAL NOT NULL,
    "figmaTeamId" TEXT,
    "figmaAccessToken" TEXT,
    "figmaRefreshToken" TEXT,
    "figmaState" TEXT,
    "integrationId" INTEGER NOT NULL,

    CONSTRAINT "FigmaIntegration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_figmaIntegrationId_fkey" FOREIGN KEY ("figmaIntegrationId") REFERENCES "FigmaIntegration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FigmaIntegration" ADD CONSTRAINT "FigmaIntegration_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
