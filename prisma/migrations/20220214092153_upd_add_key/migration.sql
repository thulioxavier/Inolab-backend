/*
  Warnings:

  - You are about to alter the column `body` on the `references` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "references" ALTER COLUMN "body" SET DATA TYPE VARCHAR(250);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "id_couser" INTEGER;

-- DropTable
DROP TABLE "Course";

-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(250) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_id_couser_fkey" FOREIGN KEY ("id_couser") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
