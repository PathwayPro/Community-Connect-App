/*
  Warnings:

  - You are about to drop the column `created_at` on the `MentorshipSessions` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `MentorshipSessions` table. All the data in the column will be lost.
  - You are about to drop the column `mentor_id` on the `MentorshipSessions` table. All the data in the column will be lost.
  - You are about to drop the `MentorshipSessionsDates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MentorshipSessionsDatesNotes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MentorshipSessionsMentees` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MentorshipSessionsRating` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dateEnd` to the `MentorshipSessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateStart` to the `MentorshipSessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `menteeId` to the `MentorshipSessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mentorId` to the `MentorshipSessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MentorshipSessions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "matching_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- DropForeignKey
ALTER TABLE "MentorshipSessions" DROP CONSTRAINT "MentorshipSessions_mentor_id_fkey";

-- DropForeignKey
ALTER TABLE "MentorshipSessionsDates" DROP CONSTRAINT "MentorshipSessionsDates_session_id_fkey";

-- DropForeignKey
ALTER TABLE "MentorshipSessionsDatesNotes" DROP CONSTRAINT "MentorshipSessionsDatesNotes_session_date_id_fkey";

-- DropForeignKey
ALTER TABLE "MentorshipSessionsDatesNotes" DROP CONSTRAINT "MentorshipSessionsDatesNotes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "MentorshipSessionsMentees" DROP CONSTRAINT "MentorshipSessionsMentees_mentee_id_fkey";

-- DropForeignKey
ALTER TABLE "MentorshipSessionsMentees" DROP CONSTRAINT "MentorshipSessionsMentees_session_id_fkey";

-- DropForeignKey
ALTER TABLE "MentorshipSessionsRating" DROP CONSTRAINT "MentorshipSessionsRating_rated_user_id_fkey";

-- DropForeignKey
ALTER TABLE "MentorshipSessionsRating" DROP CONSTRAINT "MentorshipSessionsRating_rating_user_id_fkey";

-- DropForeignKey
ALTER TABLE "MentorshipSessionsRating" DROP CONSTRAINT "MentorshipSessionsRating_session_id_fkey";

-- AlterTable
ALTER TABLE "MentorshipSessions" DROP COLUMN "created_at",
DROP COLUMN "description",
DROP COLUMN "mentor_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dateEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dateStart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "link" TEXT,
ADD COLUMN     "menteeId" INTEGER NOT NULL,
ADD COLUMN     "mentorId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "MentorshipSessionsDates";

-- DropTable
DROP TABLE "MentorshipSessionsDatesNotes";

-- DropTable
DROP TABLE "MentorshipSessionsMentees";

-- DropTable
DROP TABLE "MentorshipSessionsRating";

-- CreateTable
CREATE TABLE "MentorshipSessionsDescriptions" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "MentorshipSessionsDescriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorshipSessionsMenteeNotes" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "MentorshipSessionsMenteeNotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorshipSessionsMentorRating" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "rate" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MentorshipSessionsMentorRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorshipSessionsMenteeRating" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "rate" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MentorshipSessionsMenteeRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchedMentorMentee" (
    "id" SERIAL NOT NULL,
    "mentorId" INTEGER NOT NULL,
    "menteeId" INTEGER NOT NULL,
    "status" "matching_status" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchedMentorMentee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MentorshipSessionsMentorRating_sessionId_key" ON "MentorshipSessionsMentorRating"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "MentorshipSessionsMenteeRating_sessionId_key" ON "MentorshipSessionsMenteeRating"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchedMentorMentee_mentorId_menteeId_key" ON "MatchedMentorMentee"("mentorId", "menteeId");

-- AddForeignKey
ALTER TABLE "MentorshipSessions" ADD CONSTRAINT "MentorshipSessions_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorshipSessions" ADD CONSTRAINT "MentorshipSessions_menteeId_fkey" FOREIGN KEY ("menteeId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorshipSessionsDescriptions" ADD CONSTRAINT "MentorshipSessionsDescriptions_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "MentorshipSessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorshipSessionsMenteeNotes" ADD CONSTRAINT "MentorshipSessionsMenteeNotes_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "MentorshipSessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorshipSessionsMentorRating" ADD CONSTRAINT "MentorshipSessionsMentorRating_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "MentorshipSessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorshipSessionsMenteeRating" ADD CONSTRAINT "MentorshipSessionsMenteeRating_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "MentorshipSessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchedMentorMentee" ADD CONSTRAINT "MatchedMentorMentee_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchedMentorMentee" ADD CONSTRAINT "MatchedMentorMentee_menteeId_fkey" FOREIGN KEY ("menteeId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
