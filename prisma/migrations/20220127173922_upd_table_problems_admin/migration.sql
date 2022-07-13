/*
  Warnings:

  - Added the required column `id_module` to the `contents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_admin` to the `modules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contents" ADD COLUMN     "id_module" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "modules" ADD COLUMN     "id_admin" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "registration" TEXT NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token_admins" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "id_admin" INTEGER NOT NULL,

    CONSTRAINT "token_admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_uuid_key" ON "admins"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admins_registration_key" ON "admins"("registration");

-- CreateIndex
CREATE UNIQUE INDEX "token_admins_token_key" ON "token_admins"("token");

-- AddForeignKey
ALTER TABLE "contents" ADD CONSTRAINT "contents_id_module_fkey" FOREIGN KEY ("id_module") REFERENCES "modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
