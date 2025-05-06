-- AlterTable
UPDATE "users" SET "deleted_at" = false WHERE "deleted_at" IS NULL;
ALTER TABLE "users" ALTER COLUMN "deleted_at" SET DEFAULT false;
ALTER TABLE "users" ALTER COLUMN "deleted_at" SET NOT NULL;