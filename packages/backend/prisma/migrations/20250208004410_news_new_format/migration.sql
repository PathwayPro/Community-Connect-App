/*
  Warnings:

  - You are about to drop the column `content` on the `News` table. All the data in the column will be lost.
  - You are about to drop the column `keywords` on the `News` table. All the data in the column will be lost.
  - You are about to drop the column `subtitle` on the `News` table. All the data in the column will be lost.
  - Added the required column `details` to the `News` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link` to the `News` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `News` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NewsType" AS ENUM ('FEATURED_POST', 'EDITORS_PICK');

-- AlterTable
ALTER TABLE "News" DROP COLUMN "content",
DROP COLUMN "keywords",
DROP COLUMN "subtitle",
ADD COLUMN     "details" TEXT NOT NULL,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "link" TEXT NOT NULL,
ADD COLUMN     "type" "NewsType" NOT NULL;
