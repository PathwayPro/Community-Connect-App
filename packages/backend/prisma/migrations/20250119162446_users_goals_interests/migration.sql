/*
  Warnings:

  - The `goal_id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "goal_id",
ADD COLUMN     "goal_id" INTEGER;

-- CreateTable
CREATE TABLE "UsersGoals" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "UsersGoals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interests" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersInterests" (
    "user_id" INTEGER NOT NULL,
    "interest_id" INTEGER NOT NULL,

    CONSTRAINT "UsersInterests_pkey" PRIMARY KEY ("user_id","interest_id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "UsersGoals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInterests" ADD CONSTRAINT "UsersInterests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInterests" ADD CONSTRAINT "UsersInterests_interest_id_fkey" FOREIGN KEY ("interest_id") REFERENCES "Interests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
