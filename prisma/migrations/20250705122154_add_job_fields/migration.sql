/*
  Warnings:

  - You are about to drop the `Candidatura` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Candidatura";

-- CreateTable
CREATE TABLE "candidaturas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "nascimento" TIMESTAMP(3) NOT NULL,
    "vaga" TEXT,
    "localizacao" TEXT,
    "curriculo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "candidaturas_pkey" PRIMARY KEY ("id")
);
