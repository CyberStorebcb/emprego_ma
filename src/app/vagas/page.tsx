"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import useTheme from "../useTheme";
import "./vagas.css";
import React from "react";

// Definição do tipo Job
interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  link: string;
  level: "Júnior" | "Pleno" | "Sênior";
  remote: boolean;
  salary: number;
  education: "Básico" | "Médio" | "Superior";
  state: string;
  region: string;
  benefits: string[];
  requirements: string[];
  createdAt: Date;
  type: "CLT" | "PJ";
  urgent: boolean;
  featured: boolean;
}

// Lista completa de municípios de todos os estados brasileiros
const municipiosPorEstado = {
  "AC": ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira", "Tarauacá", "Feijó", "Brasileia", "Plácido de Castro", "Xapuri", "Epitaciolândia", "Senador Guiomard"],
  "AL": ["Maceió", "Arapiraca", "Palmeira dos Índios", "Rio Largo", "Penedo", "União dos Palmares", "São Miguel dos Campos", "Santana do Ipanema", "Coruripe", "Delmiro Gouveia"],
  "AP": ["Macapá", "Santana", "Laranjal do Jari", "Oiapoque", "Mazagão", "Porto Grande", "Vitória do Jari", "Pedra Branca do Amapari", "Tartarugalzinho", "Amapá"],
  "AM": ["Manaus", "Parintins", "Itacoatiara", "Manacapuru", "Coari", "Tefé", "Tabatinga", "Maués", "São Paulo de Olivença", "Humaitá", "Lábrea", "Manicoré"],
  "BA": ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Juazeiro", "Itabuna", "Lauro de Freitas", "Ilhéus", "Jequié", "Teixeira de Freitas", "Alagoinhas", "Barreiras", "Paulo Afonso", "Simões Filho", "Santo Antônio de Jesus"],
  "CE": ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Sobral", "Maracanaú", "Crato", "Itapipoca", "Maranguape", "Iguatu", "Quixadá", "Canindé", "Aquiraz", "Pacatuba", "Crateús", "Russas"],
  "DF": ["Brasília", "Taguatinga", "Ceilândia", "Águas Claras", "Guará", "Sobradinho", "Planaltina", "Gama", "Santa Maria", "São Sebastião", "Recanto das Emas", "Samambaia"],
  "ES": ["Vitória", "Serra", "Cariacica", "Vila Velha", "Cachoeiro de Itapemirim", "Linhares", "São Mateus", "Colatina", "Guarapari", "Viana", "Nova Venécia", "Aracruz", "Anchieta", "Domingos Martins"],
  "GO": ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Águas Lindas", "Valparaíso de Goiás", "Trindade", "Formosa", "Novo Gama", "Itumbiara", "Senador Canedo", "Catalão", "Jataí", "Planaltina", "Caldas Novas"],
  "MA": ["São Luís", "Imperatriz", "Caxias", "Timon", "Codó", "Paço do Lumiar", "Açailândia", "Bacabal", "Balsas", "Santa Inês", "Pinheiro", "Barra do Corda", "Chapadinha", "São José de Ribamar", "Pedreiras"],
  "MT": ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra", "Cáceres", "Sorriso", "Lucas do Rio Verde", "Primavera do Leste", "Barra do Garças", "Pontes e Lacerda", "Alta Floresta", "Mirassol d'Oeste", "Diamantino"],
  "MS": ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Ponta Porã", "Naviraí", "Nova Andradina", "Aquidauana", "Sidrolândia", "Maracaju", "Coxim", "Paranaíba", "Amambai", "Bonito", "Jardim"],
  "MG": ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim", "Montes Claros", "Ribeirão das Neves", "Uberaba", "Governador Valadares", "Ipatinga", "Sete Lagoas", "Divinópolis", "Santa Luzia", "Ibirité", "Poços de Caldas", "Patos de Minas", "Pouso Alegre", "Teófilo Otoni", "Barbacena", "Sabará"],
  "PA": ["Belém", "Ananindeua", "Santarém", "Marabá", "Parauapebas", "Castanhal", "Abaetetuba", "Cametá", "Marituba", "Bragança", "Altamira", "Itaituba", "Tucuruí", "Paragominas", "Redenção", "Barcarena", "Óbidos", "Capanema"],
  "PB": ["João Pessoa", "Campina Grande", "Santa Rita", "Patos", "Bayeux", "Sousa", "Cajazeiras", "Guarabira", "Monteiro", "Pombal", "Cabedelo", "Sapé", "Mamanguape", "Esperança", "Itabaiana"],
  "PR": ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel", "São José dos Pinhais", "Foz do Iguaçu", "Colombo", "Guarapuava", "Paranaguá", "Araucária", "Toledo", "Apucarana", "Pinhais", "Campo Largo", "Arapongas", "Almirante Tamandaré", "Umuarama", "Paranavaí", "Sarandi"],
  "PE": ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru", "Petrolina", "Paulista", "Cabo de Santo Agostinho", "Camaragibe", "Garanhuns", "Vitória de Santo Antão", "Igarassu", "Abreu e Lima", "Santa Cruz do Capibaribe", "Ipojuca", "Serra Talhada", "Gravatá", "Carpina", "Goiana", "Belo Jardim"],
  "PI": ["Teresina", "Parnaíba", "Picos", "Piripiri", "Floriano", "Campo Maior", "Barras", "União", "Altos", "Pedro II", "Valença", "Esperantina", "São Raimundo Nonato", "Amarante", "Água Branca"],
  "RJ": ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Niterói", "Belford Roxo", "São João de Meriti", "Campos dos Goytacazes", "Petrópolis", "Volta Redonda", "Magé", "Macaé", "Itaboraí", "Cabo Frio", "Angra dos Reis", "Nova Friburgo", "Barra Mansa", "Teresópolis", "Mesquita", "Nilópolis"],
  "RN": ["Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante", "Macaíba", "Ceará-Mirim", "Caicó", "Assu", "Currais Novos", "Nova Cruz", "João Câmara", "Canguaretama", "Touros", "Santa Cruz", "Pau dos Ferros"],
  "RS": ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria", "Gravataí", "Viamão", "Novo Hamburgo", "São Leopoldo", "Rio Grande", "Alvorada", "Passo Fundo", "Sapucaia do Sul", "Uruguaiana", "Santa Cruz do Sul", "Cachoeirinha", "Bagé", "Bento Gonçalves", "Erechim", "Guaíba"],
  "RO": ["Porto Velho", "Ji-Paraná", "Ariquemes", "Vilhena", "Cacoal", "Rolim de Moura", "Guajará-Mirim", "Jaru", "Ouro Preto do Oeste", "Machadinho d'Oeste", "Presidente Médici", "Espigão d'Oeste", "Colorado do Oeste", "Cerejeiras"],
  "RR": ["Boa Vista", "Rorainópolis", "Caracaraí", "Alto Alegre", "Mucajaí", "Cantá", "Normandia", "Bonfim", "Caroebe", "São Luiz", "São João da Baliza", "Iracema", "Amajari", "Pacaraima", "Uiramutã"],
  "SC": ["Florianópolis", "Joinville", "Blumenau", "São José", "Criciúma", "Chapecó", "Itajaí", "Lages", "Jaraguá do Sul", "Palhoça", "Balneário Camboriú", "Brusque", "Tubarão", "São Bento do Sul", "Caçador", "Camboriú", "Navegantes", "Concórdia", "Rio do Sul", "Araranguá"],
  "SP": ["São Paulo", "Guarulhos", "Campinas", "São Bernardo do Campo", "Santos", "Osasco", "Santo André", "São José dos Campos", "Ribeirão Preto", "Sorocaba", "Mauá", "São José do Rio Preto", "Mogi das Cruzes", "Diadema", "Jundiaí", "Carapicuíba", "Piracicaba", "Bauru", "Itaquaquecetuba", "Franca", "Guarujá", "Taubaté", "Praia Grande", "Limeira", "Suzano"],
  "SE": ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana", "São Cristóvão", "Estância", "Tobias Barreto", "Simão Dias", "Propriá", "Canindé de São Francisco", "Glória", "Carmópolis", "Aquidabã", "Ribeirópolis", "Neópolis"],
  "TO": ["Palmas", "Araguaína", "Gurupi", "Porto Nacional", "Paraíso do Tocantins", "Colinas do Tocantins", "Guaraí", "Formoso do Araguaia", "Tocantinópolis", "Araguatins", "Pedro Afonso", "Miracema do Tocantins", "Dianópolis", "Taguatinga", "Augustinópolis"]
};

// Regiões do Brasil
const regioesPorEstado = {
  "AC": "Norte", "AL": "Nordeste", "AP": "Norte", "AM": "Norte", "BA": "Nordeste",
  "CE": "Nordeste", "DF": "Centro-Oeste", "ES": "Sudeste", "GO": "Centro-Oeste",
  "MA": "Nordeste", "MT": "Centro-Oeste", "MS": "Centro-Oeste", "MG": "Sudeste",
  "PA": "Norte", "PB": "Nordeste", "PR": "Sul", "PE": "Nordeste", "PI": "Nordeste",
  "RJ": "Sudeste", "RN": "Nordeste", "RS": "Sul", "RO": "Norte", "RR": "Norte",
  "SC": "Sul", "SP": "Sudeste", "SE": "Nordeste", "TO": "Norte"
};

// Gerar lista completa de municípios
const municipios: { nome: string; uf: string; regiao: string }[] = [];
Object.entries(municipiosPorEstado).forEach(([uf, cidades]) => {
  cidades.forEach(cidade => {
    municipios.push({
      nome: cidade,
      uf: uf,
      regiao: regioesPorEstado[uf as keyof typeof regioesPorEstado]
    });
  });
});

// Empresas por região - EXPANDIDAS
const empresasPorRegiao = {
  "Norte": [
    "Amazônia Tech", "Norte Digital", "Floresta Solutions", "Pará Sistemas", 
    "Acre Tecnologia", "Roraima Corp", "Tocantins IT", "Amapá Web",
    "Rondônia Solutions", "Amazonas Digital", "Norte Consultoria", "Floresta Corp",
    "Biodiversidade Tech", "Região Norte SA", "Extrativa Digital", "Florestal Systems"
  ],
  "Nordeste": [
    "Nordeste Solutions", "Caatinga Tech", "Sertão Digital", "Litoral Corp", 
    "Bahia Sistemas", "Ceará Innovation", "Pernambuco IT", "Sergipe Web",
    "Alagoas Tech", "Paraíba Digital", "Maranhão Solutions", "Piauí Corp",
    "Tropical Systems", "Nordeste Energia", "Sal Marinho Tech", "Região Nordeste SA"
  ],
  "Centro-Oeste": [
    "Cerrado Tech", "Pantanal Solutions", "Brasília Digital", "Goiás Corp", 
    "Mato Grosso IT", "Centro-Oeste Web", "Planalto Systems", "Agro Tech",
    "MS Solutions", "Distrito Federal Digital", "Goiânia Corp", "Cuiabá IT",
    "Agronegócio Brasil", "Savana Systems", "Capital Tech", "Centro Digital"
  ],
  "Sudeste": [
    "Sudeste Solutions", "SP Tech", "Rio Digital", "Minas Corp", 
    "Espírito Santo IT", "Mata Atlântica Web", "Vale Systems", "Metropole Tech",
    "São Paulo Solutions", "RJ Digital", "BH Tech", "Vitória Corp",
    "Industrial Brasil", "Café Tech", "Mineira Systems", "Fluminense Digital"
  ],
  "Sul": [
    "Sul Solutions", "Gaúcho Tech", "Paraná Digital", "Santa Catarina Corp", 
    "Pampa IT", "Serra Web", "Litoral Sul Systems", "Região Sul Tech",
    "RS Solutions", "SC Digital", "PR Tech", "Curitiba Corp",
    "Pinheiro Systems", "Erva-Mate Tech", "Gaucha Digital", "Araucária Solutions"
  ]
};

// Títulos expandidos por escolaridade - MELHORADOS
const titulosBasico = [
  "Auxiliar de Serviços Gerais", "Atendente de Telemarketing", "Repositor de Mercadorias",
  "Operador de Caixa", "Auxiliar de Limpeza", "Recepcionista", "Auxiliar Administrativo",
  "Estoquista", "Zelador", "Auxiliar de Cozinha", "Porteiro", "Garçom", "Camareira",
  "Balconista", "Auxiliar de Produção", "Empacotador", "Entregador", "Vigilante",
  "Auxiliar de Manutenção", "Copeiro", "Auxiliar de Vendas", "Faxineiro", "Jardineiro",
  "Ajudante Geral", "Auxiliar de Almoxarifado", "Operador de Máquinas Simples",
  "Auxiliar de Padaria", "Auxiliar de Açougue", "Auxiliar de Farmácia", "Motorista Entregador"
];

const titulosMedio = [
  "Assistente Administrativo", "Vendedor", "Técnico em Informática", "Técnico em Enfermagem",
  "Motorista", "Auxiliar de RH", "Técnico de Segurança", "Técnico em Logística",
  "Técnico em Edificações", "Técnico em Contabilidade", "Técnico em Eletrônica",
  "Técnico em Mecânica", "Assistente de Vendas", "Técnico em Telecomunicações",
  "Técnico em Química", "Operador de Máquinas", "Técnico em Automação",
  "Assistente de Marketing", "Técnico em Radiologia", "Técnico em Farmácia",
  "Técnico em Análises Clínicas", "Técnico em Agronegócio", "Secretário Executivo",
  "Assistente Financeiro", "Técnico em Meio Ambiente", "Técnico em Alimentos",
  "Técnico em Estética", "Técnico em Design", "Técnico em Turismo", "Técnico em Administração"
];

const titulosSuperior = [
  "Engenheiro Civil", "Médico", "Advogado", "Analista de Sistemas", "Desenvolvedor Full Stack",
  "Gerente de Projetos", "Farmacêutico", "Professor", "Arquiteto", "Administrador",
  "Contador", "Enfermeiro", "Psicólogo", "Nutricionista", "Fisioterapeuta",
  "Engenheiro de Software", "Analista de Marketing", "Gerente Comercial", "Dentista",
  "Biomédico", "Veterinário", "Analista Financeiro", "Consultor de Vendas",
  "Engenheiro de Produção", "Analista de RH", "Product Manager", "Data Scientist",
  "Engenheiro Eletricista", "Engenheiro Mecânico", "Médico Veterinário", "Analista Contábil",
  "Coordenador de Projetos", "Especialista em TI", "Analista de Negócios", "Auditor",
  "Consultor Empresarial", "Gerente de Operações", "Diretor Comercial", "Engenheiro Agrônomo",
  "Cientista de Dados", "UX/UI Designer", "DevOps Engineer", "Analista de Segurança",
  "Gerente de Marketing", "Coordenador de Vendas", "Especialista em Cloud", "Scrum Master"
];

// Benefícios por tipo de empresa
const beneficiosPorTipo = {
  "Básico": [
    "Vale transporte", "Vale alimentação", "Plano de saúde básico", "Seguro de vida",
    "Cesta básica", "Auxílio creche", "Participação nos lucros", "Desconto em produtos"
  ],
  "Médio": [
    "Plano de saúde e odontológico", "Vale alimentação/refeição", "Seguro de vida",
    "Participação nos lucros", "Auxílio educação", "Gympass", "Day off no aniversário",
    "Horário flexível", "Auxílio home office", "Convênios e descontos"
  ],
  "Superior": [
    "Plano de saúde premium", "Previdência privada", "Bônus por performance",
    "Participação nos lucros", "Auxílio educação", "Carro da empresa", "Notebook",
    "Trabalho remoto", "Viagens corporativas", "Stock options", "Auxílio mudança",
    "Licença maternidade/paternidade estendida", "Sabático", "Mentoria executiva"
  ]
};

const niveis = ["Júnior", "Pleno", "Sênior"];
const escolaridades = ["Básico", "Médio", "Superior"];

function randomFrom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getJobDescription(education: string, title: string, regiao: string, cidade: string, estado: string): string {
  const descriptions = {
    "Básico": [
      `Excelente oportunidade para ${title} em ${cidade} (${estado}). Não exige experiência prévia, oferecemos treinamento completo e crescimento profissional.`,
      `Vaga para ${title} na região ${regiao}. Empresa oferece capacitação, ambiente acolhedor e oportunidades de desenvolvimento.`,
      `Buscamos ${title} para integrar nossa equipe em ${cidade}. Benefícios inclusos, estabilidade e crescimento garantido.`
    ],
    "Médio": [
      `Procuramos ${title} com formação técnica para atuar em ${cidade} (${estado}). Experiência desejável, ambiente inovador e salário competitivo.`,
      `Vaga para ${title} em empresa consolidada na região ${regiao}. Oportunidade de crescimento, benefícios diferenciados e trabalho em equipe.`,
      `Oportunidade para ${title} com conhecimentos técnicos em ${cidade}. Salário compatível com o mercado, PLR e desenvolvimento profissional.`
    ],
    "Superior": [
      `Excelente oportunidade para ${title} com formação superior em ${cidade} (${estado}). Empresa líder do mercado, benefícios premium e carreira internacional.`,
      `Vaga para ${title} sênior com ampla experiência na região ${regiao}. Benefícios diferenciados, stock options e liderança de equipes.`,
      `Buscamos ${title} para posição estratégica em ${cidade}. Pacote de benefícios atrativo, trabalho remoto e crescimento acelerado na carreira.`
    ]
  };
  
  return randomFrom(descriptions[education as keyof typeof descriptions]);
}

function getSalaryByEducation(education: string, regiao: string): number {
  const multipliers = {
    "Sudeste": 1.4,
    "Sul": 1.25,
    "Centro-Oeste": 1.15,
    "Nordeste": 0.9,
    "Norte": 0.85
  };
  
  const multiplier = multipliers[regiao as keyof typeof multipliers];
  
  if (education === "Básico") {
    return Math.floor((1400 + Math.random() * 1500) * multiplier);
  } else if (education === "Médio") {
    return Math.floor((2200 + Math.random() * 2500) * multiplier);
  } else {
    return Math.floor((5000 + Math.random() * 15000) * multiplier);
  }
}

function getJobBenefits(education: string): string[] {
  const benefits = beneficiosPorTipo[education as keyof typeof beneficiosPorTipo];
  const numBenefits = Math.floor(Math.random() * 4) + 3; // 3 a 6 benefícios
  return benefits.sort(() => 0.5 - Math.random()).slice(0, numBenefits);
}

function getJobRequirements(education: string, title: string): string[] {
  const requirements = {
    "Básico": [
      "Ensino fundamental completo",
      "Disponibilidade de horário",
      "Boa comunicação",
      "Trabalho em equipe",
      "Pontualidade e assiduidade"
    ],
    "Médio": [
      "Ensino médio completo",
      "Curso técnico na área",
      "Experiência de 1-2 anos",
      "Conhecimentos em informática",
      "Proatividade",
      "Capacidade analítica"
    ],
    "Superior": [
      "Ensino superior completo",
      "Experiência de 3+ anos",
      "Inglês intermediário/avançado",
      "Liderança de equipes",
      "Visão estratégica",
      "Conhecimentos avançados na área"
    ]
  };
  
  const baseReqs = requirements[education as keyof typeof requirements];
  const numReqs = Math.floor(Math.random() * 3) + 3; // 3 a 5 requisitos
  return baseReqs.sort(() => 0.5 - Math.random()).slice(0, numReqs);
}

function isRemoteAllowed(title: string): boolean {
  const remoteKeywords = [
    "Desenvolvedor", "Programador", "Analista de Sistemas", "Engenheiro de Software",
    "Full Stack", "Frontend", "Backend", "DevOps", "Mobile", "Software", "Designer",
    "Suporte Técnico", "Analista", "Consultor", "Data Scientist", "Product Manager",
    "UX/UI Designer", "Scrum Master", "Coordenador", "Especialista em TI"
  ];
  return remoteKeywords.some((kw) => title.toLowerCase().includes(kw.toLowerCase()));
}

function gerarVagasBrasil(): Job[] {
  const vagas: Job[] = [];
  const totalVagas = 15000;
  const totalMunicipios = municipios.length;
  
  // Cada município recebe pelo menos 1 vaga
  let vagasRestantes = totalVagas - totalMunicipios;
  const vagasPorMunicipio = Array(totalMunicipios).fill(1);

  // Distribuir vagas extras com peso para capitais e grandes centros
  while (vagasRestantes > 0) {
    const idx = Math.floor(Math.random() * totalMunicipios);
    const municipio = municipios[idx];
    
    // Maior peso para capitais e grandes centros
    const isCapital = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Salvador", "Fortaleza", 
                       "Brasília", "Curitiba", "Recife", "Porto Alegre", "Manaus", "Belém", 
                       "Goiânia", "Campinas", "Guarulhos", "Nova Iguaçu", "São Bernardo do Campo",
                       "Londrina", "Maringá", "Joinville", "Natal", "João Pessoa", "Teresina"].includes(municipio.nome);
    
    const extraChance = isCapital ? 0.5 : 0.15;
    
    if (Math.random() < extraChance || vagasRestantes < 100) {
      vagasPorMunicipio[idx]++;
      vagasRestantes--;
    }
  }

  let id = 1;
  
  municipios.forEach((municipio, idx) => {
    const regiao = municipio.regiao;
    const empresasRegiao = empresasPorRegiao[regiao as keyof typeof empresasPorRegiao];
    
    for (let i = 0; i < vagasPorMunicipio[idx]; i++) {
      const education = randomFrom(escolaridades);
      let title = "";
      let level: Job["level"] = "Júnior";
      
      if (education === "Básico") {
        title = randomFrom(titulosBasico);
        level = "Júnior";
      } else if (education === "Médio") {
        title = randomFrom(titulosMedio);
        level = randomFrom(["Júnior", "Pleno"]);
      } else {
        title = randomFrom(titulosSuperior);
        level = randomFrom(["Pleno", "Sênior"]);
      }

      const empresa = randomFrom(empresasRegiao);
      const salary = getSalaryByEducation(education, regiao);
      const remote = isRemoteAllowed(title) && Math.random() < 0.3;
      const benefits = getJobBenefits(education);
      const requirements = getJobRequirements(education, title);
      const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Últimos 30 dias
      
      vagas.push({
        id: id++,
        title,
        company: empresa,
        location: `${municipio.nome}, ${municipio.uf}`,
        description: getJobDescription(education, title, regiao, municipio.nome, municipio.uf),
        link: `https://empregobrasil.com/vaga-${id}`,
        level,
        remote,
        salary,
        education: education as Job["education"],
        state: municipio.uf,
        region: regiao,
        benefits,
        requirements,
        createdAt,
        type: education === "Básico" ? "CLT" : Math.random() < 0.8 ? "CLT" : "PJ",
        urgent: Math.random() < 0.1, // 10% das vagas são urgentes
        featured: Math.random() < 0.05 // 5% das vagas são destacadas
      });
    }
  });

  return vagas.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Ordenar por data
}

// --- OTIMIZAÇÃO: useMemo para geração de dados e listas derivadas ---

export default function Vagas() {
  const [search, setSearch] = useState("");
  const [onlyRemote, setOnlyRemote] = useState(false);
  const [onlyUrgent, setOnlyUrgent] = useState(false);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [region, setRegion] = useState("");
  const [level, setLevel] = useState("");
  const [education, setEducation] = useState("");
  const [salary, setSalary] = useState(0);
  const [sortBy, setSortBy] = useState<"recent" | "salary" | "alphabetical">("recent");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<Job | null>(null);
  const { dark, setDark, mounted } = useTheme();
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const knobRef = useRef<HTMLSpanElement>(null);
  const [page, setPage] = useState(1);
  const VAGAS_POR_PAGINA = 10;

  // Gere as vagas apenas uma vez
  const jobs = useMemo(() => gerarVagasBrasil(), []);

  // Gere listas derivadas apenas quando jobs mudar
  const allCities = useMemo(() => Array.from(new Set(jobs.map(j => j.location))).sort(), [jobs]);
  const allStates = useMemo(() => Array.from(new Set(jobs.map(j => j.state))).sort(), [jobs]);
  const allRegions = useMemo(() => Array.from(new Set(jobs.map(j => j.region))).sort(), [jobs]);
  const allLevels = useMemo(() => Array.from(new Set(jobs.map(j => j.level))), [jobs]);

  // Filtro dinâmico memoizado
  const filteredJobs = useMemo(() => jobs.filter(
    (job) =>
      (!onlyRemote || job.remote) &&
      (!onlyUrgent || job.urgent) &&
      (!city || job.location === city) &&
      (!state || job.state === state) &&
      (!region || job.region === region) &&
      (!level || job.level === level) &&
      (!education || job.education === education) &&
      (salary === 0 || job.salary >= salary) &&
      (job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.location.toLowerCase().includes(search.toLowerCase()) ||
        job.state.toLowerCase().includes(search.toLowerCase()) ||
        job.region.toLowerCase().includes(search.toLowerCase()))
  ), [jobs, onlyRemote, onlyUrgent, city, state, region, level, education, salary, search]);

  // Ordenação memoizada
  const finalJobs = useMemo(() => {
    const sorted = [...filteredJobs].sort((a, b) => {
      if (sortBy === "recent") return b.createdAt.getTime() - a.createdAt.getTime();
      if (sortBy === "salary") return b.salary - a.salary;
      return a.title.localeCompare(b.title);
    });
    return sorted.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [filteredJobs, sortBy]);

  // Paginação das vagas filtradas
  const totalPages = Math.ceil(finalJobs.length / VAGAS_POR_PAGINA);
  const paginatedJobs = useMemo(() => {
    const start = (page - 1) * VAGAS_POR_PAGINA;
    return finalJobs.slice(start, start + VAGAS_POR_PAGINA);
  }, [finalJobs, page]);

  // Resetar para página 1 ao mudar filtros
  useEffect(() => {
    setPage(1);
  }, [search, onlyRemote, onlyUrgent, city, state, region, level, education, salary, sortBy]);

  // Copiar link da vaga
  function handleCopy(link: string, id: number) {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  // Drag logic
  function onDragStart(e: React.MouseEvent | React.TouchEvent) {
    setDragging(true);
    setDragX(0);
    document.body.style.userSelect = "none";
  }
  function onDragMove(e: MouseEvent | TouchEvent) {
    if (!dragging) return;
    let clientX = 0;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    const rect = knobRef.current?.parentElement?.getBoundingClientRect();
    if (!rect) return;
    let x = clientX - rect.left - 12;
    x = Math.max(0, Math.min(x, 26));
    setDragX(x);
  }
  function onDragEnd() {
    if (!dragging) return;
    setDragging(false);
    document.body.style.userSelect = "";
    setDark(dragX > 13 ? true : false);
    setDragX(0);
  }
  React.useEffect(() => {
    if (!dragging) return;
    const move = (e: MouseEvent | TouchEvent) => onDragMove(e);
    const up = () => onDragEnd();
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
  }, [dragging, dragX]);

  if (!mounted) return null;

  return (
    <div className={`vagas-root ${dark ? "darkMode" : ""}`}>
      <header className="vagas-header">
        <div className="vagas-header-content">
          <Link href="/" className="vagas-logo">
            <span>
              Emprego<span style={{ color: dark ? "#fbbf24" : "#2563eb" }}>Brasil</span>
            </span>
          </Link>
          <nav>
            <Link href="/" className="vagas-navlink">
              Início
            </Link>
            <Link href="/vagas" className="vagas-navlink active">
              Vagas
            </Link>
            <a href="mailto:contato@empregobrasil.com" className="vagas-navlink">
              Contato
            </a>
          </nav>
        </div>
        <button
          className="themeSwitch"
          aria-label={dark ? "Ativar modo claro" : "Ativar modo escuro"}
          type="button"
          style={{
            position: "absolute",
            top: 18,
            right: 32,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 24,
            padding: 4,
            color: dark ? "#fbbf24" : "#2563eb",
            transition: "color 0.2s"
          }}
          onClick={() => setDark((v: boolean) => !v)}
        >
          {dark ? "🌙" : "☀️"}
        </button>
      </header>

      <section className="vagas-hero">
        <h1>
          Encontre <span>vagas</span> em todo o Brasil
        </h1>
        <p>
          Oportunidades de emprego em todas as regiões do país.
          <br />
          <strong>15.000 vagas atualizadas em mais de 400 cidades brasileiras!</strong>
        </p>
      </section>

      <section className="vagas-filtros">
        <input
          type="text"
          placeholder="🔎 Buscar vaga, empresa, cidade ou estado..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar vaga"
          style={{ minWidth: 260, maxWidth: 340, width: "100%" }}
        />
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          aria-label="Filtrar por região"
        >
          <option value="">Todas regiões</option>
          {allRegions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          aria-label="Filtrar por estado"
        >
          <option value="">Todos estados</option>
          {allStates.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          aria-label="Filtrar por cidade"
        >
          <option value="">Todas cidades</option>
          {allCities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          aria-label="Filtrar por nível"
        >
          <option value="">Todos níveis</option>
          {allLevels.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <select
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          aria-label="Filtrar por escolaridade"
        >
          <option value="">Todas escolaridades</option>
          {["Básico", "Médio", "Superior"].map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "recent" | "salary" | "alphabetical")}
          aria-label="Ordenar por"
        >
          <option value="recent">Mais recentes</option>
          <option value="salary">Maior salário</option>
          <option value="alphabetical">A-Z</option>
        </select>
        <label className="vagas-checkbox">
          <input
            type="checkbox"
            checked={onlyRemote}
            onChange={() => setOnlyRemote((v) => !v)}
          />
          Remoto
        </label>
        <label className="vagas-checkbox">
          <input
            type="checkbox"
            checked={onlyUrgent}
            onChange={() => setOnlyUrgent((v) => !v)}
          />
          Urgente
        </label>
        <label className="vagas-checkbox" style={{ minWidth: 120 }}>
          Salário mínimo:
          <input
            type="number"
            min={0}
            max={50000}
            step={100}
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value))}
            style={{ width: 90, marginLeft: 8 }}
            aria-label="Filtrar por salário mínimo"
          />
        </label>
      </section>

      <main className="vagas-main">
        <div className="vagas-count">
          <span>
            {finalJobs.length.toLocaleString()} vaga
            {finalJobs.length !== 1 && "s"} encontrada
            {finalJobs.length !== 1 && "s"} em {allCities.length} cidades
          </span>
        </div>
        <ul className="vagas-list">
          {paginatedJobs.length === 0 && (
            <li className="vagas-nojobs">
              <span role="img" aria-label="Sem vagas">😕</span>
              <p>Nenhuma vaga encontrada para os filtros selecionados.</p>
            </li>
          )}
          {paginatedJobs.map((job) => (
            <li key={job.id} className={`vagas-card ${job.featured ? "featured" : ""}`}>
              <div
                className="vagas-card-header"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  color: dark ? "#cbd5e1" : "#232946" // <-- cor do texto principal
                }}
              >
                <h2
                  style={{
                    color: dark ? "#fbbf24" : "#2563eb",
                    fontWeight: 800,
                    fontSize: "1.2rem",
                    margin: 0
                  }}
                >
                  {job.title}
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                  {job.featured && <span className="vagas-badge vagas-badge-featured">⭐ Destaque</span>}
                  {job.urgent && <span className="vagas-badge vagas-badge-urgent">🔥 Urgente</span>}
                  <span className={`vagas-badge vagas-badge-${job.level.toLowerCase()}`}>{job.level}</span>
                  {job.remote && <span className="vagas-badge vagas-badge-remote">🏠 Remoto</span>}
                  <span className="vagas-badge" style={{ background: "#e0f2fe", color: "#0369a1" }}>{job.region}</span>
                  <span className="vagas-badge" style={{ background: "#f0fdf4", color: "#15803d" }}>{job.type}</span>
                </div>
                <div
                  style={{
                    color: dark ? "#94a3b8" : "#232946",
                    fontWeight: 500,
                    fontSize: "1rem",
                    marginTop: 2
                  }}
                >
                  <span>🏢 {job.company}</span> &nbsp;|&nbsp;
                  <span>📍 {job.location}</span> &nbsp;|&nbsp;
                  <span>📅 {job.createdAt.toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
              <div
                className="vagas-card-desc"
                style={{
                  margin: "10px 0",
                  color: dark ? "#cbd5e1" : "#232946", // <-- cor da descrição
                  fontSize: "1rem"
                }}
              >
                {job.description}
              </div>
              <div
                className="vagas-card-benefits"
                style={{
                  marginBottom: 8,
                  color: dark ? "#cbd5e1" : "#232946" // <-- cor dos benefícios
                }}
              >
                <strong>Benefícios:</strong> {job.benefits.slice(0, 3).join(", ")}
                {job.benefits.length > 3 && " ..."}
              </div>
              <div
                className="vagas-card-info"
                style={{
                  display: "flex",
                  gap: 16,
                  flexWrap: "wrap",
                  fontSize: "1rem",
                  color: dark ? "#cbd5e1" : "#232946" // <-- cor das infos
                }}
              >
                <span>🎓 {job.education}</span>
                <span>💰 R$ {job.salary.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="vagas-card-actions" style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <button className="vagas-btn" aria-label={`Ver detalhes da vaga para ${job.title} na empresa ${job.company}`} onClick={() => setShowModal(job)}>
                  Ver detalhes
                </button>
                <button className="vagas-btn vagas-btn-yellow" onClick={() => handleCopy(job.link, job.id)} aria-label="Copiar link da vaga">
                  {copiedId === job.id ? "Link copiado!" : "Copiar link"}
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Paginação */}
        {totalPages > 1 && (
          <nav
            className="vagas-pagination"
            style={{
              display: "flex",
              gap: 4,
              justifyContent: "center",
              margin: "24px 0",
              flexWrap: "wrap",
              alignItems: "center"
            }}
            aria-label="Paginação de vagas"
          >
            <button
              className="vagas-btn"
              onClick={() => setPage(1)}
              disabled={page === 1}
              aria-label="Primeira página"
            >
              {"<<"}
            </button>
            <button
              className="vagas-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Página anterior"
            >
              {"<"}
            </button>
            {/* Lógica de páginas dinâmicas */}
            {(() => {
              const pages = [];
              let start = Math.max(1, page - 3);
              let end = Math.min(totalPages, page + 3);

              if (page <= 4) {
                start = 1;
                end = Math.min(totalPages, 7);
              } else if (page >= totalPages - 3) {
                start = Math.max(1, totalPages - 6);
                end = totalPages;
              }

              if (start > 1) {
                pages.push(
                  <span key="start-ellipsis" style={{ padding: "0 6px", color: "#94a3b8" }}>...</span>
                );
              }

              for (let i = start; i <= end; i++) {
                pages.push(
                  <button
                    key={i}
                    className={`vagas-btn${page === i ? " active" : ""}`}
                    style={{
                      fontWeight: page === i ? 700 : 400,
                      minWidth: 36,
                      background: page === i ? (dark ? "#fbbf24" : "#2563eb") : undefined,
                      color: page === i ? (dark ? "#232946" : "#fff") : undefined,
                    }}
                    onClick={() => setPage(i)}
                    aria-current={page === i ? "page" : undefined}
                  >
                    {i}
                  </button>
                );
              }

              if (end < totalPages) {
                pages.push(
                  <span key="end-ellipsis" style={{ padding: "0 6px", color: "#94a3b8" }}>...</span>
                );
              }

              return pages;
            })()}
            <button
              className="vagas-btn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Próxima página"
            >
              {">"}
            </button>
            <button
              className="vagas-btn"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              aria-label="Última página"
            >
              {">>"}
            </button>
          </nav>
        )}
      </main>

      <footer className="vagas-footer">
        <div>
          <a href="mailto:contato@empregobrasil.com">Contato</a>
          <a href="/sobre">Sobre</a>
          <a href="/privacidade">Privacidade</a>
        </div>
        <small>© {new Date().getFullYear()} Emprego Brasil - Conectando talentos em todo o país • {jobs.length.toLocaleString()} vagas ativas</small>
      </footer>

      {showModal && (
        <div
          className="vagas-modal-bg vagas-modal-blur"
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          onClick={() => setShowModal(null)}
        >
          <div className="vagas-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420, width: "95vw" }}>
            <button
              className="vagas-modal-close"
              aria-label="Fechar detalhes"
              onClick={() => setShowModal(null)}
            >
              ×
            </button>
            <div className="vagas-modal-header">
              <h2 style={{ color: dark ? "#fbbf24" : "#2563eb", marginBottom: 8 }}>{showModal.title}</h2>
              <div className="vagas-badges" style={{ marginBottom: 12 }}>
                {showModal.featured && (
                  <span className="vagas-badge vagas-badge-featured">⭐ Destaque</span>
                )}
                {showModal.urgent && (
                  <span className="vagas-badge vagas-badge-urgent">🔥 Urgente</span>
                )}
                <span className={`vagas-badge vagas-badge-${showModal.level.toLowerCase()}`}>
                  {showModal.level}
                </span>
                {showModal.remote && (
                  <span className="vagas-badge vagas-badge-remote">🏠 Remoto</span>
                )}
              </div>
            </div>
            
            <div className="vagas-modal-content">
              <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: 18 }}>
                <li><strong>Empresa:</strong> {showModal.company}</li>
                <li><strong>Localização:</strong> {showModal.location}</li>
                <li><strong>Região:</strong> {showModal.region}</li>
                <li><strong>Nível:</strong> {showModal.level}</li>
                <li><strong>Escolaridade:</strong> {showModal.education}</li>
                <li><strong>Tipo:</strong> {showModal.type}</li>
                <li><strong>Salário:</strong> R$ {showModal.salary.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</li>
                <li><strong>Modalidade:</strong> {showModal.remote ? "Remoto" : "Presencial"}</li>
                <li><strong>Publicado em:</strong> {showModal.createdAt.toLocaleDateString('pt-BR')}</li>
              </ul>
              
              <div style={{ marginBottom: 18 }}>
                <strong>Descrição:</strong>
                <p>{showModal.description}</p>
              </div>

              <div style={{ marginBottom: 18 }}>
                <strong>Requisitos:</strong>
                <ul style={{ marginLeft: 20 }}>
                  {showModal.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>

              <div style={{ marginBottom: 18 }}>
                <strong>Benefícios:</strong>
                <ul style={{ marginLeft: 20 }}>
                  {showModal.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>

            <hr style={{ margin: "18px 0" }} />

            <h3 style={{ fontSize: "1.1rem", marginBottom: 10, color: dark ? "#fbbf24" : "#2563eb" }}>
              Candidatar-se para esta vaga
            </h3>
            <CandidateForm jobTitle={showModal.title} jobLocation={showModal.location} dark={dark} />
          </div>
        </div>
      )}
    </div>
  );
}

function CandidateForm({ jobTitle, jobLocation, dark }: { jobTitle: string; jobLocation: string; dark: boolean }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  // Validação de campos
  const [touched, setTouched] = useState<{[k: string]: boolean}>({});
  const [errors, setErrors] = useState<{[k: string]: string}>({});

  function validate() {
    const errs: {[k: string]: string} = {};
    if (!nome.trim()) errs.nome = "Informe seu nome completo.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "E-mail inválido.";
    if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(telefone)) errs.telefone = "Telefone no formato (99) 99999-9999.";
    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) errs.cpf = "CPF no formato 000.000.000-00.";
    if (!nascimento) errs.nascimento = "Informe sua data de nascimento.";
    return errs;
  }

  useEffect(() => {
    setErrors(validate());
  }, [nome, email, telefone, cpf, nascimento]);

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function formatarCPF(value: string) {
    const numeros = value.replace(/\D/g, '');
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  function formatarTelefone(value: string) {
    const numeros = value.replace(/\D/g, '');
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({nome:true,email:true,telefone:true,cpf:true,nascimento:true});
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setEnviando(true);
    setErro("");

    try {
      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("email", email);
      formData.append("telefone", telefone);
      formData.append("cpf", cpf);
      formData.append("nascimento", nascimento);
      formData.append("vaga", jobTitle);
      formData.append("localizacao", jobLocation);

      const res = await fetch("/api/candidatura", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.sucesso) {
        setEnviado(true);
        setNome("");
        setEmail("");
        setTelefone("");
        setCpf("");
        setNascimento("");
        setTouched({});
        setTimeout(() => setEnviado(false), 3000);
      } else {
        setErro(data.erro || "Erro ao enviar candidatura. Tente novamente.");
      }
    } catch (error) {
      setErro("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  const inputBase = {
    padding: 10,
    borderRadius: 6,
    fontSize: "1rem",
    background: dark ? "#232946" : "#fff",
    color: dark ? "#fbbf24" : "#1e293b",
    border: dark ? "1.5px solid #fbbf24" : "1.5px solid #2563eb",
    outline: "none"
  };

  function inputStyle(field: string) {
    return {
      ...inputBase,
      border: touched[field] && errors[field]
        ? "1.5px solid #dc2626"
        : inputBase.border
    };
  }

  return (
    <form onSubmit={handleSubmit} style={{
      display: "flex",
      flexDirection: "column",
      gap: 14,
      maxWidth: 380,
      margin: "0 auto",
      width: "100%"
    }}>
      <input
        type="text"
        placeholder="Seu nome completo"
        value={nome}
        onChange={e => setNome(e.target.value)}
        onBlur={() => handleBlur("nome")}
        required
        style={inputStyle("nome")}
        aria-invalid={!!errors.nome}
        aria-describedby="erro-nome"
      />
      {touched.nome && errors.nome && (
        <span id="erro-nome" style={{ color: "#dc2626", fontSize: "0.92rem", marginTop: -10 }}>{errors.nome}</span>
      )}

      <input
        type="email"
        placeholder="Seu e-mail"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onBlur={() => handleBlur("email")}
        required
        style={inputStyle("email")}
        aria-invalid={!!errors.email}
        aria-describedby="erro-email"
      />
      {touched.email && errors.email && (
        <span id="erro-email" style={{ color: "#dc2626", fontSize: "0.92rem", marginTop: -10 }}>{errors.email}</span>
      )}

      <input
        type="tel"
        placeholder="Seu WhatsApp (99) 99999-9999"
        value={telefone}
        onChange={e => setTelefone(formatarTelefone(e.target.value))}
        onBlur={() => handleBlur("telefone")}
        required
        maxLength={15}
        style={inputStyle("telefone")}
        aria-invalid={!!errors.telefone}
        aria-describedby="erro-telefone"
      />
      {touched.telefone && errors.telefone && (
        <span id="erro-telefone" style={{ color: "#dc2626", fontSize: "0.92rem", marginTop: -10 }}>{errors.telefone}</span>
      )}

      <input
        type="text"
        placeholder="CPF (000.000.000-00)"
        value={cpf}
        onChange={e => setCpf(formatarCPF(e.target.value))}
        onBlur={() => handleBlur("cpf")}
        required
        maxLength={14}
        style={inputStyle("cpf")}
        aria-invalid={!!errors.cpf}
        aria-describedby="erro-cpf"
      />
      {touched.cpf && errors.cpf && (
        <span id="erro-cpf" style={{ color: "#dc2626", fontSize: "0.92rem", marginTop: -10 }}>{errors.cpf}</span>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <label
          htmlFor="nascimento"
          style={{
            color: dark ? "#fbbf24" : "#2563eb",
            fontWeight: 600,
            fontSize: "0.95rem"
          }}
        >
          📅 Data de nascimento:
        </label>
        <input
          id="nascimento"
          type="date"
          value={nascimento}
          onChange={e => setNascimento(e.target.value)}
          onBlur={() => handleBlur("nascimento")}
          required
          style={inputStyle("nascimento")}
          max={new Date(new Date().setFullYear(new Date().getFullYear() - 16)).toISOString().split('T')[0]}
          min={new Date(new Date().setFullYear(new Date().getFullYear() - 80)).toISOString().split('T')[0]}
          aria-invalid={!!errors.nascimento}
          aria-describedby="erro-nascimento"
        />
        <small style={{ color: dark ? "#94a3b8" : "#64748b", fontSize: "0.85rem" }}>
          Idade mínima: 16 anos
        </small>
        {touched.nascimento && errors.nascimento && (
          <span id="erro-nascimento" style={{ color: "#dc2626", fontSize: "0.92rem", marginTop: -10 }}>{errors.nascimento}</span>
        )}
      </div>

      {erro && (
        <div style={{
          color: "#dc2626",
          fontWeight: 600,
          fontSize: "0.9rem",
          padding: "10px",
          backgroundColor: "#fef2f2",
          borderRadius: "6px",
          border: "1px solid #fecaca"
        }}>
          ⚠️ {erro}
        </div>
      )}

      <button
        type="submit"
        className="vagas-btn"
        style={{
          marginTop: 8,
          fontWeight: 700,
          background: dark ? "#fbbf24" : "#2563eb",
          color: dark ? "#232946" : "#fff",
          border: "none",
          padding: "12px 24px",
          borderRadius: "8px",
          fontSize: "1rem",
          cursor: enviando || enviado ? "not-allowed" : "pointer",
          opacity: enviando || enviado ? 0.7 : 1
        }}
        disabled={enviando || enviado}
      >
        {enviando ? "📤 Enviando..." : enviado ? "✅ Enviado!" : "🚀 Enviar candidatura"}
      </button>

      {enviado && (
        <div style={{
          color: "#22c55e",
          fontWeight: 600,
          marginTop: 8,
          padding: "10px",
          backgroundColor: "#f0fdf4",
          borderRadius: "6px",
          border: "1px solid #bbf7d0",
          textAlign: "center"
        }}>
          ✅ Candidatura enviada com sucesso! Entraremos em contato em breve.
        </div>
      )}
    </form>
  );
}