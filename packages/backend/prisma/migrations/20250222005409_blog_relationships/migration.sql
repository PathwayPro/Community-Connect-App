/*
  Warnings:

  - Added the required column `post_id` to the `PostsComments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_id` to the `PostsLikes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_id` to the `PostsSaves` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PostsComments" ADD COLUMN     "post_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PostsLikes" ADD COLUMN     "post_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PostsSaves" ADD COLUMN     "post_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "PostsComments" ADD CONSTRAINT "PostsComments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsLikes" ADD CONSTRAINT "PostsLikes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsSaves" ADD CONSTRAINT "PostsSaves_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
