/*
  Warnings:

  - You are about to drop the `usersGoals` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "usersGoals";

-- CreateTable
CREATE TABLE "UsersGoals" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "UsersGoals_pkey" PRIMARY KEY ("id")
);
