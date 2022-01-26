-- AddForeignKey
ALTER TABLE "modules" ADD CONSTRAINT "modules_id_subject_fkey" FOREIGN KEY ("id_subject") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
