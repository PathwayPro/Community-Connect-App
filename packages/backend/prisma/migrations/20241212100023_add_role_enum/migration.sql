/*
  Warnings:

  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EnumRole" AS ENUM ('USER', 'ADMIN', 'MENTOR');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" "EnumRole" NOT NULL DEFAULT 'USER';