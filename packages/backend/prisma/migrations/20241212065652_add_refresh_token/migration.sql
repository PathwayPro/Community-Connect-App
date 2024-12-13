-- AlterTable
ALTER TABLE "users" ADD COLUMN     "last_logout" TIMESTAMP(3),
ADD COLUMN     "refresh_token" VARCHAR(255);
