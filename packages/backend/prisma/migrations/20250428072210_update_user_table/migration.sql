-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deleted_at" BOOLEAN,
ADD COLUMN     "last_login" TIMESTAMP(3);
