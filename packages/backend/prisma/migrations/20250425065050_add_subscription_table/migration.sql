-- CreateEnum
CREATE TYPE "NewsletterStatus" AS ENUM ('PENDING', 'SUBSCRIBED', 'UNSUBSCRIBED');

-- CreateTable
CREATE TABLE "NewsletterSubscriptions" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "NewsletterStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "NewsletterSubscriptions_pkey" PRIMARY KEY ("id")
);
