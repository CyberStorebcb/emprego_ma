import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    console.log("Iniciando processamento da candidatura...");
    
    const data = await req.formData();
    const nome = data.get("nome") as string;
    const email = data.get("email") as string;
    const telefone = data.get("telefone") as string;
    const cpf = data.get("cpf") as string;
    const nascimento = data.get("nascimento") as string;
    const vaga = data.get("vaga") as string;
    const localizacao = data.get("localizacao") as string;

    console.log("Dados recebidos:", { nome, email, telefone, cpf, nascimento, vaga, localizacao });

    // Validar campos obrigatórios
    if (!nome || !email || !telefone || !cpf || !nascimento) {
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
        email,
        telefone,
        cpf,
        nascimento: dataValida,
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
        email: candidatura.email,
        vaga: vaga,
        localizacao: localizacao
      }
    });

  } catch (error) {
    console.error("Erro detalhado:", error);
    
    // Tratar diferentes tipos de erro
    if (error instanceof Error) {
      if (error.message.includes("connect")) {
        return NextResponse.json(
          { sucesso: false, erro: "Erro de conexão com o banco de dados." },
          { status: 503 }
        );
      }
      
      if (error.message.includes("unique constraint")) {
        return NextResponse.json(
          { sucesso: false, erro: "E-mail ou CPF já cadastrado para esta vaga." },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { sucesso: false, erro: "Erro interno do servidor. Tente novamente." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
