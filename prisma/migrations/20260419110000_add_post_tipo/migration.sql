-- Distingue posts de portfólio dos posts do feed pessoal do profissional
ALTER TABLE "posts" ADD COLUMN "tipo" VARCHAR(20) NOT NULL DEFAULT 'portfolio';
