/*
  Warnings:

  - Added the required column `details` to the `Resources` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Resources` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('INVOICE', 'RESUME', 'BANNER');

-- AlterTable
ALTER TABLE "Resources" ADD COLUMN     "details" TEXT NOT NULL,
ADD COLUMN     "type" "ResourceType" NOT NULL;
