-- AlterTable
UPDATE "users" SET "deleted_at" = false WHERE "deleted_at" IS NULL;
