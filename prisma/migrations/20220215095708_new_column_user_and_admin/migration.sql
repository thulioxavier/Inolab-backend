/*
  Warnings:

  - Added the required column `last_name` to the `admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "last_name" VARCHAR(250) NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "last_name" VARCHAR(250) NOT NULL;
