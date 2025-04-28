/*
  Warnings:

  - Made the column `deleted_at` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "deleted_at" SET NOT NULL,
ALTER COLUMN "deleted_at" SET DEFAULT false;
