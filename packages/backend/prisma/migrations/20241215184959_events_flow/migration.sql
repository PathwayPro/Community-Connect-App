-- CreateEnum
CREATE TYPE "EventsTypes" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "EventsDatesStatus" AS ENUM ('READY', 'IN_PROGRESS', 'RESCHEDULED', 'CANCELED');

-- CreateEnum
CREATE TYPE "EventsSubscriptionsStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Events" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "link" TEXT,
    "image" TEXT,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "type" "EventsTypes" NOT NULL DEFAULT 'PUBLIC',
    "req_confirm" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventsCategories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "EventsCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventsDates" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "EventsDatesStatus" NOT NULL DEFAULT 'READY',

    CONSTRAINT "EventsDates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventsDatesUpdates" (
    "id" SERIAL NOT NULL,
    "event_date_id" INTEGER NOT NULL,
    "prev_status" "EventsDatesStatus" NOT NULL,
    "new_status" "EventsDatesStatus" NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "EventsDatesUpdates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventsSpeakers" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "eventsSpeakers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventsManagers" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "is_speaker" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EventsManagers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventsSubscriptions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "status" "EventsSubscriptionsStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventsSubscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventsSubscriptionsUpdates" (
    "id" SERIAL NOT NULL,
    "subscription_id" INTEGER NOT NULL,
    "prev_status" "EventsSubscriptionsStatus" NOT NULL,
    "new_status" "EventsSubscriptionsStatus" NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER NOT NULL,

    CONSTRAINT "EventsSubscriptionsUpdates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventsInvitations" (
    "id" SERIAL NOT NULL,
    "inviter_id" INTEGER NOT NULL,
    "invitee_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventsInvitations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "EventsCategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventsDates" ADD CONSTRAINT "EventsDates_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventsDatesUpdates" ADD CONSTRAINT "EventsDatesUpdates_event_date_id_fkey" FOREIGN KEY ("event_date_id") REFERENCES "EventsDates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventsSpeakers" ADD CONSTRAINT "eventsSpeakers_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventsManagers" ADD CONSTRAINT "EventsManagers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventsManagers" ADD CONSTRAINT "EventsManagers_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventsSubscriptions" ADD CONSTRAINT "EventsSubscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventsSubscriptions" ADD CONSTRAINT "EventsSubscriptions_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventsSubscriptionsUpdates" ADD CONSTRAINT "EventsSubscriptionsUpdates_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "EventsSubscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventsSubscriptionsUpdates" ADD CONSTRAINT "EventsSubscriptionsUpdates_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventsInvitations" ADD CONSTRAINT "EventsInvitations_inviter_id_fkey" FOREIGN KEY ("inviter_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventsInvitations" ADD CONSTRAINT "EventsInvitations_invitee_id_fkey" FOREIGN KEY ("invitee_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventsInvitations" ADD CONSTRAINT "EventsInvitations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
