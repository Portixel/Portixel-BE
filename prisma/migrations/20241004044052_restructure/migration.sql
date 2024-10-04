/*
  Warnings:

  - The primary key for the `WaitList` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `seat` on the `WaitList` table. All the data in the column will be lost.
  - The `id` column on the `WaitList` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "WaitList" DROP CONSTRAINT "WaitList_pkey",
DROP COLUMN "seat",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "WaitList_pkey" PRIMARY KEY ("id");
