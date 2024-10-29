/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `GithubIntegration` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GithubIntegration_userId_key" ON "GithubIntegration"("userId");
