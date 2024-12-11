-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "middle_name" VARCHAR(255),
    "last_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "dob" DATE,
    "show_dob" BOOLEAN NOT NULL DEFAULT false,
    "arrival_in_canada" DATE,
    "goal_id" INTEGER,
    "role" VARCHAR(10) NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
