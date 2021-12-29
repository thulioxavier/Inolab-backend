/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `token_users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "token_users_token_key" ON "token_users"("token");
