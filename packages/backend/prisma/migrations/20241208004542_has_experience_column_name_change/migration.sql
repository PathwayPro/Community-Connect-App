/*
  Warnings:

  - You are about to drop the column `has_experience` on the `Mentor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Mentor" DROP COLUMN "has_experience",
ADD COLUMN     "hasExperience" BOOLEAN NOT NULL DEFAULT false;
