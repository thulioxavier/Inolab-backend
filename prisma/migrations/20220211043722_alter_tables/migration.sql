/*
  Warnings:

  - You are about to alter the column `uuid` on the `admins` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - You are about to alter the column `name` on the `admins` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - You are about to alter the column `email` on the `admins` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - You are about to alter the column `password` on the `admins` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - You are about to alter the column `registration` on the `admins` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - You are about to alter the column `title` on the `content_videos` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - You are about to alter the column `title` on the `contents` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - You are about to alter the column `title` on the `examples` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `body` on the `examples` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `name` on the `modules` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - You are about to alter the column `name` on the `subjects` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - You are about to alter the column `name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - You are about to alter the column `password` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - You are about to alter the column `registration` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - Added the required column `abstract` to the `contents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "avatar" VARCHAR(250) DEFAULT E'https://cdn-icons-png.flaticon.com/512/147/147144.png',
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "uuid" SET DATA TYPE VARCHAR(250),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(250),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(250),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(250),
ALTER COLUMN "registration" DROP NOT NULL,
ALTER COLUMN "registration" SET DATA TYPE VARCHAR(250);

-- AlterTable
ALTER TABLE "content_videos" ALTER COLUMN "title" SET DATA TYPE VARCHAR(250);

-- AlterTable
ALTER TABLE "contents" ADD COLUMN     "abstract" VARCHAR(250) NOT NULL,
ADD COLUMN     "id_admin" INTEGER,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(250);

-- AlterTable
ALTER TABLE "examples" ALTER COLUMN "title" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "body" SET DATA TYPE VARCHAR(200);

-- AlterTable
ALTER TABLE "modules" ALTER COLUMN "name" SET DATA TYPE VARCHAR(250),
ALTER COLUMN "id_admin" DROP NOT NULL;

-- AlterTable
ALTER TABLE "subjects" ALTER COLUMN "name" SET DATA TYPE VARCHAR(250);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar" TEXT DEFAULT E'https://cdn-icons-png.flaticon.com/512/147/147144.png',
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(250),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(250),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(250),
ALTER COLUMN "registration" SET DATA TYPE VARCHAR(250);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(250) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag_contents" (
    "id" SERIAL NOT NULL,
    "id_tag" INTEGER NOT NULL,
    "id_content" INTEGER NOT NULL,

    CONSTRAINT "tag_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "id_content" INTEGER NOT NULL,
    "time" INTEGER,
    "body" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "options" (
    "id" SERIAL NOT NULL,
    "id_question" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "control_users" (
    "id" SERIAL NOT NULL,
    "platform" VARCHAR(250) NOT NULL,
    "version" VARCHAR(250) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "control_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(250) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "token_admins" ADD CONSTRAINT "token_admins_id_admin_fkey" FOREIGN KEY ("id_admin") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modules" ADD CONSTRAINT "modules_id_admin_fkey" FOREIGN KEY ("id_admin") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contents" ADD CONSTRAINT "contents_id_admin_fkey" FOREIGN KEY ("id_admin") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_contents" ADD CONSTRAINT "tag_contents_id_content_fkey" FOREIGN KEY ("id_content") REFERENCES "contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_contents" ADD CONSTRAINT "tag_contents_id_tag_fkey" FOREIGN KEY ("id_tag") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_id_content_fkey" FOREIGN KEY ("id_content") REFERENCES "contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "options" ADD CONSTRAINT "options_id_question_fkey" FOREIGN KEY ("id_question") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
