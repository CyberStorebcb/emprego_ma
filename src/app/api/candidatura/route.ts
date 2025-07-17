import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    console.log("Iniciando processamento da candidatura...");
    
    const data = await req.formData();
    const nome = data.get("nome") as string;
    const telefone = data.get("telefone") as string;
    const cpf = data.get("cpf") as string;
    const nascimento = data.get("nascimento") as string;
    const vaga = data.get("vaga") as string;
    const localizacao = data.get("localizacao") as string;

    console.log("Dados recebidos:", { nome, telefone, cpf, nascimento, vaga, localizacao });

    // Validar campos obrigatórios
    if (!nome || !telefone || !cpf || !nascimento) {
      console.error("Campos obrigatórios não preenchidos");
      return NextResponse.json(
        { sucesso: false, erro: "Todos os campos obrigatórios devem ser preenchidos." },
        { status: 400 }
      );
    }

    // Validar formato da data
    const dataValida = new Date(nascimento);
    if (isNaN(dataValida.getTime())) {
      console.error("Data inválida:", nascimento);
      return NextResponse.json(
        { sucesso: false, erro: "Data de nascimento inválida." },
        { status: 400 }
      );
    }

    console.log("Conectando ao banco de dados...");
    
    const candidatura = await prisma.candidatura.create({
      data: {
        nome,
        telefone,
        cpf,
        nascimento: dataValida,
        vaga,
        localizacao,
        curriculo: null, // Implementar upload de arquivo posteriormente
      },
    });

    console.log("Candidatura criada com sucesso:", candidatura);

    return NextResponse.json({ 
      sucesso: true, 
      mensagem: "Candidatura enviada com sucesso!",
      candidatura: {
        id: candidatura.id,
        nome: candidatura.nome,
        telefone: candidatura.telefone,
        cpf: candidatura.cpf,
        nascimento: candidatura.nascimento,
        vaga: candidatura.vaga,
        localizacao: candidatura.localizacao,
      }
    });

  } catch (error) {
    console.error("Erro detalhado:", error);
    
    return NextResponse.json(
      { sucesso: false, erro: "Erro interno do servidor. Tente novamente." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
