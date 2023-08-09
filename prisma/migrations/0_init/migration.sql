-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "comment" (
    "comment_uid" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "content" VARCHAR(500) NOT NULL,
    "ispublished" BOOLEAN NOT NULL DEFAULT false,
    "comment_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "thread_ref" UUID,
    "author_ref" UUID,
    "likes" UUID[],

    CONSTRAINT "comment_pkey" PRIMARY KEY ("comment_uid")
);

-- CreateTable
CREATE TABLE "messenger" (
    "message_uid" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "content" VARCHAR(1000) NOT NULL,
    "message_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author_ref" UUID,
    "recepient_ref" UUID,

    CONSTRAINT "messenger_pkey" PRIMARY KEY ("message_uid")
);

-- CreateTable
CREATE TABLE "thread" (
    "thread_uid" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "content" VARCHAR(500) NOT NULL,
    "ispublished" BOOLEAN NOT NULL DEFAULT false,
    "thread_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author_ref" UUID,
    "likes" UUID[],
    "comments" UUID[],

    CONSTRAINT "thread_pkey" PRIMARY KEY ("thread_uid")
);

-- CreateTable
CREATE TABLE "wreathe_user" (
    "user_uid" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "first_name" VARCHAR(30) NOT NULL,
    "last_name" VARCHAR(30) NOT NULL,
    "email" VARCHAR(100),
    "username" VARCHAR(50) NOT NULL,
    "user_password" VARCHAR(100) NOT NULL,

    CONSTRAINT "wreathe_user_pkey" PRIMARY KEY ("user_uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "wreathe_user_email_key" ON "wreathe_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "wreathe_user_username_key" ON "wreathe_user"("username");

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_author_ref_fkey" FOREIGN KEY ("author_ref") REFERENCES "wreathe_user"("user_uid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_thread_ref_fkey" FOREIGN KEY ("thread_ref") REFERENCES "thread"("thread_uid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messenger" ADD CONSTRAINT "messenger_author_ref_fkey" FOREIGN KEY ("author_ref") REFERENCES "wreathe_user"("user_uid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messenger" ADD CONSTRAINT "messenger_recepient_ref_fkey" FOREIGN KEY ("recepient_ref") REFERENCES "wreathe_user"("user_uid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "thread" ADD CONSTRAINT "thread_author_ref_fkey" FOREIGN KEY ("author_ref") REFERENCES "wreathe_user"("user_uid") ON DELETE NO ACTION ON UPDATE NO ACTION;

