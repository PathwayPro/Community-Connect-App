/*
  Warnings:

  - You are about to drop the column `manager_id` on the `Events` table. All the data in the column will be lost.
  - You are about to drop the column `speakers_id` on the `Events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Events" DROP COLUMN "manager_id",
DROP COLUMN "speakers_id";
