/*
  Warnings:

  - You are about to drop the column `skills` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "skills";

-- CreateTable
CREATE TABLE "Skills" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersSkills" (
    "user_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,

    CONSTRAINT "UsersSkills_pkey" PRIMARY KEY ("user_id","skill_id")
);

-- AddForeignKey
ALTER TABLE "UsersSkills" ADD CONSTRAINT "UsersSkills_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersSkills" ADD CONSTRAINT "UsersSkills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "Skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
