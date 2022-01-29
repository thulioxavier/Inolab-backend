-- CreateTable
CREATE TABLE "contents" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,

    CONSTRAINT "contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "examples" (
    "id" SERIAL NOT NULL,
    "id_content" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,

    CONSTRAINT "examples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "references" (
    "id" SERIAL NOT NULL,
    "body" TEXT NOT NULL,
    "id_content" INTEGER NOT NULL,

    CONSTRAINT "references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_videos" (
    "id" SERIAL NOT NULL,
    "id_content" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "content_videos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "examples" ADD CONSTRAINT "examples_id_content_fkey" FOREIGN KEY ("id_content") REFERENCES "contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "references" ADD CONSTRAINT "references_id_content_fkey" FOREIGN KEY ("id_content") REFERENCES "contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_videos" ADD CONSTRAINT "content_videos_id_content_fkey" FOREIGN KEY ("id_content") REFERENCES "contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
