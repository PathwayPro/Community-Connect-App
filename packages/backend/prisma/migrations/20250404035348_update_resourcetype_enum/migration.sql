-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ResourceType" ADD VALUE 'COVER_LETTER';
ALTER TYPE "ResourceType" ADD VALUE 'LINKEDIN';
ALTER TYPE "ResourceType" ADD VALUE 'BUSINESS_CARD';
ALTER TYPE "ResourceType" ADD VALUE 'EMAIL_SIGNATURE';
ALTER TYPE "ResourceType" ADD VALUE 'PORTFOLIO';
ALTER TYPE "ResourceType" ADD VALUE 'PERSONAL_BRANDING';
ALTER TYPE "ResourceType" ADD VALUE 'JOB_APPLICATION_TRACKER';
ALTER TYPE "ResourceType" ADD VALUE 'INTERVIEW_PREP';
ALTER TYPE "ResourceType" ADD VALUE 'NETWORKING_TIPS';
ALTER TYPE "ResourceType" ADD VALUE 'CAREER_PLANNING';
ALTER TYPE "ResourceType" ADD VALUE 'SALARY_NEGOTIATION';
ALTER TYPE "ResourceType" ADD VALUE 'OTHER';
