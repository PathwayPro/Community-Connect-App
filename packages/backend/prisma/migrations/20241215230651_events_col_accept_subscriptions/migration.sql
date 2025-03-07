/*
  Warnings:

  - You are about to drop the column `req_confirm` on the `Events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Events" DROP COLUMN "req_confirm",
ADD COLUMN     "accept_subscriptions" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "requires_confirmation" BOOLEAN NOT NULL DEFAULT false;
