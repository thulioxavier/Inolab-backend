-- AlterTable
ALTER TABLE "options" ALTER COLUMN "body" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "answers" (
    "id" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_question" INTEGER NOT NULL,
    "id_option" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    "points" INTEGER NOT NULL,
    "time_spent" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_id_question_fkey" FOREIGN KEY ("id_question") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_id_option_fkey" FOREIGN KEY ("id_option") REFERENCES "options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
