/*
  Warnings:

  - The primary key for the `WaitList` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `seat` on the `WaitList` table. All the data in the column will be lost.
  - The `id` column on the `WaitList` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[email_address]` on the table `WaitList` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Template` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "WaitList" DROP CONSTRAINT "WaitList_pkey",
DROP COLUMN "seat",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "WaitList_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "WaitList_email_address_key" ON "WaitList"("email_address");

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
