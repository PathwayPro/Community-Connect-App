-- CreateTable
CREATE TABLE "PostsCommentsLikes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostsCommentsLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostsCommentsSaves" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostsCommentsSaves_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostsCommentsLikes_user_id_comment_id_key" ON "PostsCommentsLikes"("user_id", "comment_id");

-- CreateIndex
CREATE UNIQUE INDEX "PostsCommentsSaves_user_id_comment_id_key" ON "PostsCommentsSaves"("user_id", "comment_id");

-- AddForeignKey
ALTER TABLE "PostsCommentsLikes" ADD CONSTRAINT "PostsCommentsLikes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "PostsComments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsCommentsLikes" ADD CONSTRAINT "PostsCommentsLikes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsCommentsSaves" ADD CONSTRAINT "PostsCommentsSaves_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "PostsComments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsCommentsSaves" ADD CONSTRAINT "PostsCommentsSaves_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
