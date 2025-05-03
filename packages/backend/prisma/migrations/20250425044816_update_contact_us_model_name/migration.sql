/*
  Warnings:

  - You are about to drop the `ConctactUs` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ContactUsStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- DropTable
DROP TABLE "ConctactUs";

-- DropEnum
DROP TYPE "ConctactUsStatus";

-- CreateTable
CREATE TABLE "ContactUs" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "company_name" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "contact_message" TEXT NOT NULL,
    "status" "ContactUsStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactUs_pkey" PRIMARY KEY ("id")
);
