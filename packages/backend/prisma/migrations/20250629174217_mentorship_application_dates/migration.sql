-- AlterEnum
ALTER TYPE "EnumRole" ADD VALUE 'MENTEE';

-- AlterEnum
ALTER TYPE "mentors_status" ADD VALUE 'ENDED';

-- DropIndex
DROP INDEX "mentees_user_id_key";

-- AlterTable
ALTER TABLE "mentees" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "mentors" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
