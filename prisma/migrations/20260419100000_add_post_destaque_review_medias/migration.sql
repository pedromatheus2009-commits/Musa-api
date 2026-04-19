-- AlterTable: adiciona campo destaque no portfólio
ALTER TABLE "posts" ADD COLUMN "destaque" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable: mídias de avaliações (fotos e vídeos)
CREATE TABLE "review_medias" (
    "id" TEXT NOT NULL,
    "review_id" TEXT NOT NULL,
    "tipo" VARCHAR(10) NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_medias_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "review_medias" ADD CONSTRAINT "review_medias_review_id_fkey"
    FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
