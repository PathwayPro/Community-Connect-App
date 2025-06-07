-- CreateEnum
CREATE TYPE "EnumRole" AS ENUM ('USER', 'ADMIN', 'MENTOR');

-- CreateEnum
CREATE TYPE "users_roles" AS ENUM ('USER', 'MENTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "mentors_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "mentees_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "EventsTypes" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "EventsDatesStatus" AS ENUM ('READY', 'IN_PROGRESS', 'RESCHEDULED', 'CANCELED');

-- CreateEnum
CREATE TYPE "EventsSubscriptionsStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "NewsType" AS ENUM ('FEATURED_POST', 'EDITORS_PICK');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('RESUME', 'COVER_LETTER', 'LINKEDIN', 'BUSINESS_CARD', 'EMAIL_SIGNATURE', 'PORTFOLIO', 'PERSONAL_BRANDING', 'JOB_APPLICATION_TRACKER', 'INTERVIEW_PREP', 'NETWORKING_TIPS', 'CAREER_PLANNING', 'SALARY_NEGOTIATION', 'INVOICE', 'BANNER', 'OTHER');

-- CreateEnum
CREATE TYPE "ConnectionRequestsStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "WorkSettings" AS ENUM ('REMOTE', 'HYBRID', 'ON_SITE');

-- CreateEnum
CREATE TYPE "ProfileVisibility" AS ENUM ('PUBLIC', 'CONNECTIONS_ONLY', 'PRIVATE');

-- CreateEnum
CREATE TYPE "ContactUsStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "NewsletterStatus" AS ENUM ('PENDING', 'SUBSCRIBED', 'UNSUBSCRIBED');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "middle_name" VARCHAR(255),
    "last_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "dob" VARCHAR(255),
    "show_dob" BOOLEAN NOT NULL DEFAULT false,
    "arrival_in_canada" VARCHAR(255),
    "role" "users_roles" NOT NULL DEFAULT 'USER',
    "verification_token" VARCHAR(255),
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "refresh_token" VARCHAR(255),
    "last_logout" TIMESTAMP(3),
    "languages" TEXT,
    "profession" TEXT,
    "experience" TEXT,
    "bio" TEXT,
    "picture_upload_link" TEXT,
    "resume_upload_link" TEXT,
    "linkedin_link" TEXT,
    "github_link" TEXT,
    "twitter_link" TEXT,
    "portfolio_link" TEXT,
    "other_links" TEXT,
    "additional_links" TEXT[],
    "province" TEXT,
    "city" TEXT,
    "country_of_origin" TEXT,
    "work_status" TEXT,
    "company_name" TEXT,
    "actively_searching" BOOLEAN,
    "age_range" TEXT,
    "goal_id" TEXT,
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3),
    "provider" TEXT,
    "deleted_at" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentors" (
    "id" SERIAL NOT NULL,
    "resume" TEXT NOT NULL,
    "max_mentees" INTEGER NOT NULL,
    "availability" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "experience_years" INTEGER NOT NULL,
    "experience_details" TEXT,
    "status" "mentors_status" NOT NULL DEFAULT 'PENDING',
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "mentors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentees" (
    "id" SERIAL NOT NULL,
    "resume" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "mentees_status" NOT NULL DEFAULT 'PENDING',
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "mentees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Events" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "link" TEXT,
    "image" TEXT,
    "is_free" BOOLEAN NOT NULL DEFAULT true,
    "date" TEXT,
    "start_time" TEXT,
    "end_time" TEXT,
    "type" "EventsTypes" NOT NULL DEFAULT 'PUBLIC',
    "requires_confirmation" BOOLEAN NOT NULL DEFAULT false,
    "accept_subscriptions" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
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

-- CreateTable
CREATE TABLE "News" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "type" "NewsType" NOT NULL,
    "link" TEXT NOT NULL,
    "image" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resources" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "type" "ResourceType" NOT NULL,
    "link" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "file" TEXT,

    CONSTRAINT "Resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interests" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersInterests" (
    "user_id" INTEGER NOT NULL,
    "interest_id" INTEGER NOT NULL,

    CONSTRAINT "UsersInterests_pkey" PRIMARY KEY ("user_id","interest_id")
);

-- CreateTable
CREATE TABLE "Skills" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersSkills" (
    "user_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,

    CONSTRAINT "UsersSkills_pkey" PRIMARY KEY ("user_id","skill_id")
);

-- CreateTable
CREATE TABLE "ConnectionRequests" (
    "id" SERIAL NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "recipient_id" INTEGER NOT NULL,
    "message" TEXT,
    "status" "ConnectionRequestsStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "ConnectionRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConnectedUsers" (
    "sender_id" INTEGER NOT NULL,
    "recipient_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConnectedUsers_pkey" PRIMARY KEY ("sender_id","recipient_id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" SERIAL NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "recipient_id" INTEGER NOT NULL,
    "message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Posts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostsComments" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PostsComments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostsLikes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostsLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostsSaves" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostsSaves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersGoals" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "UsersGoals_pkey" PRIMARY KEY ("id")
);

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
    "experience" TEXT,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "shareBirthDate" BOOLEAN NOT NULL DEFAULT true,
    "shareContactDetails" BOOLEAN NOT NULL DEFAULT true,
    "shareSocialLinks" BOOLEAN NOT NULL DEFAULT true,
    "profileVisibility" "ProfileVisibility" NOT NULL DEFAULT 'PUBLIC',

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactUs" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "company_name" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "contact_message" TEXT NOT NULL,
    "status" "ContactUsStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactUs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterSubscriptions" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "NewsletterStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "NewsletterSubscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "mentors_user_id_key" ON "mentors"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "mentees_user_id_key" ON "mentees"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "PostsLikes_user_id_post_id_key" ON "PostsLikes"("user_id", "post_id");

-- CreateIndex
CREATE UNIQUE INDEX "PostsSaves_user_id_post_id_key" ON "PostsSaves"("user_id", "post_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- AddForeignKey
ALTER TABLE "mentors" ADD CONSTRAINT "mentors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentees" ADD CONSTRAINT "mentees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resources" ADD CONSTRAINT "Resources_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInterests" ADD CONSTRAINT "UsersInterests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInterests" ADD CONSTRAINT "UsersInterests_interest_id_fkey" FOREIGN KEY ("interest_id") REFERENCES "Interests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersSkills" ADD CONSTRAINT "UsersSkills_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersSkills" ADD CONSTRAINT "UsersSkills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "Skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectionRequests" ADD CONSTRAINT "ConnectionRequests_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectionRequests" ADD CONSTRAINT "ConnectionRequests_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectedUsers" ADD CONSTRAINT "ConnectedUsers_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectedUsers" ADD CONSTRAINT "ConnectedUsers_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsComments" ADD CONSTRAINT "PostsComments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsComments" ADD CONSTRAINT "PostsComments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsLikes" ADD CONSTRAINT "PostsLikes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsLikes" ADD CONSTRAINT "PostsLikes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsSaves" ADD CONSTRAINT "PostsSaves_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsSaves" ADD CONSTRAINT "PostsSaves_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunities" ADD CONSTRAINT "Opportunities_salary_range_id_fkey" FOREIGN KEY ("salary_range_id") REFERENCES "SalaryRanges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

