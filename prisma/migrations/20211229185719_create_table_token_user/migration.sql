-- CreateTable
CREATE TABLE "token_users" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "id_user" INTEGER NOT NULL,

    CONSTRAINT "token_users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "token_users" ADD CONSTRAINT "token_users_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
