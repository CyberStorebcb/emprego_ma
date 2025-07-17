import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const nome = data.get("nome") as string;
    const telefone = data.get("telefone") as string;
    const cpf = data.get("cpf") as string;
    const nascimento = data.get("nascimento") as string;
    const vaga = data.get("vaga") as string;
    const localizacao = data.get("localizacao") as string;

    if (!nome || !telefone || !cpf || !nascimento) {
      return NextResponse.json(
        { sucesso: false, erro: "Todos os campos obrigatórios devem ser preenchidos." },
        { status: 400 }
      );
    }

    const candidatura = await prisma.candidatura.create({
      data: {
        nome,
        telefone,
        cpf,
        nascimento,
        vaga,
        localizacao,
        curriculo: null,
      },
    });

    return NextResponse.json({ sucesso: true, candidatura });

  } catch (error) {
    console.error(error); // Veja o erro real no terminal!
    return NextResponse.json(
      { sucesso: false, erro: "Erro interno do servidor. Tente novamente." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
