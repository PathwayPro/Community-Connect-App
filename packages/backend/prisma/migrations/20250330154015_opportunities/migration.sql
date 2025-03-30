-- CreateEnum
CREATE TYPE "WorkSettings" AS ENUM ('REMOTE', 'HYBRID', 'ON_SITE');

-- CreateTable
CREATE TABLE "SalaryRanges" (
    "id" SERIAL NOT NULL,
    "from" INTEGER NOT NULL,
    "to" INTEGER NOT NULL,

    CONSTRAINT "SalaryRanges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opportunities" (
    "id" SERIAL NOT NULL,
    "job" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "salary_range_id" INTEGER NOT NULL,
    "settings" "WorkSettings" NOT NULL,
    "link_apply" TEXT NOT NULL,
    "link_post" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Opportunities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Opportunities" ADD CONSTRAINT "Opportunities_salary_range_id_fkey" FOREIGN KEY ("salary_range_id") REFERENCES "SalaryRanges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
