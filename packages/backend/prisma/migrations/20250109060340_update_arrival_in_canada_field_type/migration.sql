/*
  Warnings:

  - The `arrival_in_canada` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "arrival_in_canada",
ADD COLUMN     "arrival_in_canada" INTEGER;
