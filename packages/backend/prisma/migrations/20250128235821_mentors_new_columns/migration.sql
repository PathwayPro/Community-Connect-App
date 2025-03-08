/*
  Warnings:

  - You are about to drop the column `has_experience` on the `mentors` table. All the data in the column will be lost.
  - Added the required column `Profession` to the `mentors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experience_years` to the `mentors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resume` to the `mentors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mentors" DROP COLUMN "has_experience",
ADD COLUMN     "profession" TEXT NOT NULL,
ADD COLUMN     "experience_years" INTEGER NOT NULL,
ADD COLUMN     "resume" TEXT NOT NULL;
