-- AlterTable
ALTER TABLE "Posts" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "PostsComments" ADD COLUMN     "deleted_at" TIMESTAMP(3);
