-- AlterTable
ALTER TABLE "PostsComments" ADD COLUMN     "parent_id" INTEGER;

-- AddForeignKey
ALTER TABLE "PostsComments" ADD CONSTRAINT "PostsComments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "PostsComments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
