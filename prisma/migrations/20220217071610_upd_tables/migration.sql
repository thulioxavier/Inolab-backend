/*
  Warnings:

  - You are about to alter the column `body` on the `options` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - Added the required column `title` to the `questions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "options" ALTER COLUMN "body" SET DATA TYPE VARCHAR(250);

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "title" VARCHAR(250) NOT NULL;
