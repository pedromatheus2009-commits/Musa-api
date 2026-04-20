-- AlterTable: link feed_posts ao perfil do profissional
ALTER TABLE "feed_posts" ADD COLUMN "profile_id" TEXT;
ALTER TABLE "feed_posts" ADD CONSTRAINT "feed_posts_profile_id_fkey"
  FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable: curtidas no feed
CREATE TABLE "feed_likes" (
    "id" TEXT NOT NULL,
    "feed_post_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feed_likes_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "feed_likes_feed_post_id_user_id_key" ON "feed_likes"("feed_post_id", "user_id");
ALTER TABLE "feed_likes" ADD CONSTRAINT "feed_likes_feed_post_id_fkey"
  FOREIGN KEY ("feed_post_id") REFERENCES "feed_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "feed_likes" ADD CONSTRAINT "feed_likes_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: comentários do feed (com suporte a threads via parent_id)
CREATE TABLE "feed_comments" (
    "id" TEXT NOT NULL,
    "feed_post_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "autor_nome" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "parent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feed_comments_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "feed_comments" ADD CONSTRAINT "feed_comments_feed_post_id_fkey"
  FOREIGN KEY ("feed_post_id") REFERENCES "feed_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "feed_comments" ADD CONSTRAINT "feed_comments_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "feed_comments" ADD CONSTRAINT "feed_comments_parent_id_fkey"
  FOREIGN KEY ("parent_id") REFERENCES "feed_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
