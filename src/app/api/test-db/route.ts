import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("Testando conexão com o banco...");
    
    // Testar a conexão
    await prisma.$connect();
    console.log("Conexão estabelecida com sucesso!");
    
    // Testar uma query simples
    const count = await prisma.candidatura.count();
    console.log(`Total de candidaturas: ${count}`);
    
    return NextResponse.json({ 
      sucesso: true, 
      mensagem: "Conexão com banco estabelecida",
      totalCandidaturas: count 
    });
    
  } catch (error) {
    console.error("Erro na conexão:", error);
    
    return NextResponse.json(
      { 
        sucesso: false, 
        erro: "Erro ao conectar com o banco de dados",
        detalhes: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}