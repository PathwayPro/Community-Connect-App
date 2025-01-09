/*
  Warnings:

  - You are about to alter the column `goal_id` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `arrival_in_canada` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "dob" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "goal_id" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "arrival_in_canada" SET DATA TYPE VARCHAR(255);
