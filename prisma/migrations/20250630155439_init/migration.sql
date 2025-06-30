-- CreateTable
CREATE TABLE "Candidatura" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "nascimento" TIMESTAMP(3) NOT NULL,
    "curriculo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Candidatura_pkey" PRIMARY KEY ("id")
);
