/*
  Warnings:

  - A unique constraint covering the columns `[user_id,post_id]` on the table `PostsLikes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,post_id]` on the table `PostsSaves` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PostsLikes_user_id_post_id_key" ON "PostsLikes"("user_id", "post_id");

-- CreateIndex
CREATE UNIQUE INDEX "PostsSaves_user_id_post_id_key" ON "PostsSaves"("user_id", "post_id");
