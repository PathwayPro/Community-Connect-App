/*
  Warnings:

  - You are about to drop the column `goal_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `UsersGoals` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_goal_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "goal_id",
ADD COLUMN     "goal" TEXT;

-- DropTable
DROP TABLE "UsersGoals";
