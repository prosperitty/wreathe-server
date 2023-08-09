-- AlterTable
ALTER TABLE "comment" ALTER COLUMN "comment_uid" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "messenger" ALTER COLUMN "message_uid" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "thread" ALTER COLUMN "thread_uid" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "wreathe_user" ALTER COLUMN "user_uid" SET DEFAULT gen_random_uuid();

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);
