/*
  Warnings:

  - You are about to drop the column `messageSettings` on the `UserSettings` table. All the data in the column will be lost.
  - The `profileVisibility` column on the `UserSettings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ProfileVisibility" AS ENUM ('PUBLIC', 'CONNECTIONS_ONLY', 'PRIVATE');

-- AlterTable
ALTER TABLE "UserSettings" DROP COLUMN "messageSettings",
ALTER COLUMN "shareBirthDate" SET DEFAULT true,
ALTER COLUMN "shareContactDetails" SET DEFAULT true,
ALTER COLUMN "shareSocialLinks" SET DEFAULT true,
DROP COLUMN "profileVisibility",
ADD COLUMN     "profileVisibility" "ProfileVisibility" NOT NULL DEFAULT 'PUBLIC';
