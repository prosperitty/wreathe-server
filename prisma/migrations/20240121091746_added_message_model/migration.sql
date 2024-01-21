/*
  Warnings:

  - The primary key for the `message` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "message" DROP CONSTRAINT "message_pkey",
ADD COLUMN     "message_uid" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "message_pkey" PRIMARY KEY ("message_uid");
