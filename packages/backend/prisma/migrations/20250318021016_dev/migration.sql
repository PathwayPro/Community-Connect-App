-- AlterTable
ALTER TABLE "users" ADD COLUMN     "actively_searching" BOOLEAN,
ADD COLUMN     "company_name" TEXT,
ADD COLUMN     "country_of_origin" TEXT,
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "work_status" TEXT;
