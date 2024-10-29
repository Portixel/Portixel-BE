-- CreateTable
CREATE TABLE "GithubIntegration" (
    "id" SERIAL NOT NULL,
    "githubAccessToken" TEXT,
    "userId" INTEGER NOT NULL,
    "integrationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GithubIntegration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GithubIntegration" ADD CONSTRAINT "GithubIntegration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubIntegration" ADD CONSTRAINT "GithubIntegration_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
