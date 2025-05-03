/*
  Warnings:

  - You are about to drop the column `message` on the `ConctactUs` table. All the data in the column will be lost.
  - Added the required column `contact_message` to the `ConctactUs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ConctactUs" DROP COLUMN "message",
ADD COLUMN     "contact_message" TEXT NOT NULL;
