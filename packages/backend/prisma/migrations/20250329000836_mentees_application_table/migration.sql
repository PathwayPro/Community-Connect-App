-- CreateEnum
CREATE TYPE "mentees_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- CreateTable
CREATE TABLE "mentees" (
    "id" SERIAL NOT NULL,
    "resume" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "mentees_status" NOT NULL DEFAULT 'PENDING',
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "mentees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mentees_user_id_key" ON "mentees"("user_id");

-- AddForeignKey
ALTER TABLE "mentees" ADD CONSTRAINT "mentees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
