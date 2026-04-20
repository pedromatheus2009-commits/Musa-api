-- AlterTable: adiciona slug único ao perfil
ALTER TABLE "profiles" ADD COLUMN "slug" VARCHAR(100);
CREATE UNIQUE INDEX "profiles_slug_key" ON "profiles"("slug");
