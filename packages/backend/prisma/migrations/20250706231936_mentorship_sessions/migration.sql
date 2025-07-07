-- CreateTable
CREATE TABLE "MentorshipSessions" (
    "id" SERIAL NOT NULL,
    "mentor_id" INTEGER NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MentorshipSessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorshipSessionsMentees" (
    "id" SERIAL NOT NULL,
    "mentee_id" INTEGER NOT NULL,
    "session_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MentorshipSessionsMentees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorshipSessionsDates" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "link" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MentorshipSessionsDates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorshipSessionsDatesNotes" (
    "id" SERIAL NOT NULL,
    "session_date_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MentorshipSessionsDatesNotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorshipSessionsRating" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "rating_user_id" INTEGER NOT NULL,
    "rating_user_role" "users_roles" NOT NULL,
    "rated_user_id" INTEGER NOT NULL,
    "rated_user_role" "users_roles" NOT NULL,
    "comments" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MentorshipSessionsRating_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MentorshipSessions" ADD CONSTRAINT "MentorshipSessions_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorshipSessionsMentees" ADD CONSTRAINT "MentorshipSessionsMentees_mentee_id_fkey" FOREIGN KEY ("mentee_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorshipSessionsMentees" ADD CONSTRAINT "MentorshipSessionsMentees_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "MentorshipSessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorshipSessionsDates" ADD CONSTRAINT "MentorshipSessionsDates_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "MentorshipSessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorshipSessionsDatesNotes" ADD CONSTRAINT "MentorshipSessionsDatesNotes_session_date_id_fkey" FOREIGN KEY ("session_date_id") REFERENCES "MentorshipSessionsDates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorshipSessionsDatesNotes" ADD CONSTRAINT "MentorshipSessionsDatesNotes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorshipSessionsRating" ADD CONSTRAINT "MentorshipSessionsRating_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "MentorshipSessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorshipSessionsRating" ADD CONSTRAINT "MentorshipSessionsRating_rating_user_id_fkey" FOREIGN KEY ("rating_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorshipSessionsRating" ADD CONSTRAINT "MentorshipSessionsRating_rated_user_id_fkey" FOREIGN KEY ("rated_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
