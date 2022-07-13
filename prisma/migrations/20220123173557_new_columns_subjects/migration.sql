/*
  Warnings:

  - The required column `uuid` was added to the `users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "subjects" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "show" BOOLEAN NOT NULL DEFAULT true,
    "icon" TEXT NOT NULL DEFAULT E'',

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);
