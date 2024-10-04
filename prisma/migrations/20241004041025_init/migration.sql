-- CreateTable
CREATE TABLE "WaitList" (
    "id" TEXT NOT NULL,
    "wallet_address" TEXT,
    "seat" SERIAL NOT NULL,
    "email_address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WaitList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WaitList_wallet_address_key" ON "WaitList"("wallet_address");
