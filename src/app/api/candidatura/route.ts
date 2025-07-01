import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const nome = data.get("nome") as string;
    const email = data.get("email") as string;
    const telefone = data.get("telefone") as string;
    const cpf = data.get("cpf") as string;
    const nascimento = data.get("nascimento") as string;

    const candidatura = await prisma.candidatura.create({
      data: {
        nome,
        email,
        telefone,
        cpf,
        nascimento: new Date(nascimento),
        curriculo: "", // ou null
      },
    });

    return NextResponse.json({ sucesso: true, candidatura });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ sucesso: false, erro: "Erro ao enviar candidatura." }, { status: 500 });
  }
}
