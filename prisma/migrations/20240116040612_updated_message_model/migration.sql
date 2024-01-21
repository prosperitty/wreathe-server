/*
  Warnings:

  - You are about to drop the `messenger` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "messenger" DROP CONSTRAINT "messenger_author_ref_fkey";

-- DropForeignKey
ALTER TABLE "messenger" DROP CONSTRAINT "messenger_recepient_ref_fkey";

-- DropTable
DROP TABLE "messenger";

-- CreateTable
CREATE TABLE "message" (
    "sender_ref" UUID NOT NULL,
    "recepient_ref" UUID NOT NULL,
    "content" VARCHAR(1000) NOT NULL,
    "message_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_pkey" PRIMARY KEY ("sender_ref","recepient_ref")
);

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_sender_ref_fkey" FOREIGN KEY ("sender_ref") REFERENCES "wreathe_user"("user_uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_recepient_ref_fkey" FOREIGN KEY ("recepient_ref") REFERENCES "wreathe_user"("user_uid") ON DELETE RESTRICT ON UPDATE CASCADE;
