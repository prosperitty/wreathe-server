/*
  Warnings:

  - You are about to drop the column `likes` on the `comment` table. All the data in the column will be lost.
  - You are about to alter the column `content` on the `comment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `VarChar(250)`.
  - You are about to drop the column `comments` on the `thread` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `thread` table. All the data in the column will be lost.
  - You are about to alter the column `content` on the `thread` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `VarChar(250)`.

*/
-- AlterTable
ALTER TABLE "comment" DROP COLUMN "likes",
ALTER COLUMN "content" SET DATA TYPE VARCHAR(250);

-- AlterTable
ALTER TABLE "thread" DROP COLUMN "comments",
DROP COLUMN "likes",
ALTER COLUMN "content" SET DATA TYPE VARCHAR(250);

-- AlterTable
ALTER TABLE "wreathe_user" ADD COLUMN     "bio" VARCHAR(150);

-- CreateTable
CREATE TABLE "likes" (
    "user_uid" UUID NOT NULL,
    "thread_uid" UUID NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("user_uid","thread_uid")
);

-- CreateTable
CREATE TABLE "comment_likes" (
    "user_uid" UUID NOT NULL,
    "comment_uid" UUID NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_likes_pkey" PRIMARY KEY ("user_uid","comment_uid")
);

-- CreateTable
CREATE TABLE "Follower" (
    "followerId" UUID NOT NULL,
    "followingId" UUID NOT NULL,

    CONSTRAINT "Follower_pkey" PRIMARY KEY ("followerId","followingId")
);

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_thread_uid_fkey" FOREIGN KEY ("thread_uid") REFERENCES "thread"("thread_uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_uid_fkey" FOREIGN KEY ("user_uid") REFERENCES "wreathe_user"("user_uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_comment_uid_fkey" FOREIGN KEY ("comment_uid") REFERENCES "comment"("comment_uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_user_uid_fkey" FOREIGN KEY ("user_uid") REFERENCES "wreathe_user"("user_uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "wreathe_user"("user_uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "wreathe_user"("user_uid") ON DELETE RESTRICT ON UPDATE CASCADE;
