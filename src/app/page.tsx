"use client";

import { useState, useEffect, useMemo } from "react";
import "./novaVaga.css";

interface Estado {
  ID: string;
  Sigla: string;
  Nome: string;
}
interface Cidade {
  ID: string;
  Nome: string;
  Estado: string;
}

const VAGAS_BASE = [
  { titulo: "Ajudante de Obras", descricao: "Suporte geral em canteiros de obra, auxiliando pedreiros e outros profissionais." },
  { titulo: "Analista de Suporte Júnior", descricao: "Presta suporte técnico básico a usuários de sistemas e equipamentos de informática." },
  { titulo: "Atendente de Loja", descricao: "Lida diretamente com o público, auxilia nas vendas e na organização do estabelecimento." },
  { titulo: "Auxiliar Administrativo", descricao: "Oferece suporte em tarefas de escritório como organização de documentos, agendamento e atendimento." },
  { titulo: "Auxiliar de Cozinha", descricao: "Ajuda no preparo dos alimentos, organização e limpeza da cozinha." },
  { titulo: "Auxiliar de Expedição", descricao: "Responsável pela organização e envio de produtos, conferindo notas fiscais e embalagens." },
  { titulo: "Auxiliar de Limpeza (Faxineira)", descricao: "Garante a higienização e organização de ambientes comerciais ou residenciais." },
  { titulo: "Auxiliar de Logística", descricao: "Suporta as operações em almoxarifados, estoques e na movimentação de mercadorias." },
  { titulo: "Auxiliar de Produção", descricao: "Atua em linhas de montagem ou processos industriais, auxiliando na fabricação de produtos." },
  { titulo: "Auxiliar de Saúde Bucal (ASB)", descricao: "Suporta o dentista em consultórios odontológicos, preparando materiais e auxiliando nos procedimentos." },
  { titulo: "Barman/Barwoman", descricao: "Prepara e serve bebidas em bares, restaurantes e eventos." },
  { titulo: "Chapeiro", descricao: "Especializado no preparo de lanches e pratos rápidos em lanchonetes e restaurantes." },
  { titulo: "Conferente de Mercadorias", descricao: "Faz a verificação e contagem de produtos recebidos ou expedidos, garantindo a conformidade." },
  { titulo: "Cozinheiro", descricao: "Prepara refeições em diversos tipos de estabelecimentos, desde restaurantes a cozinhas industriais." },
  { titulo: "Eletricista (manutenção/instalação)", descricao: "Realiza a manutenção e instalação de sistemas elétricos em residências, comércios e indústrias." },
  { titulo: "Garçom", descricao: "Atende clientes em restaurantes, bares e eventos, servindo alimentos e bebidas." },
  { titulo: "Instalador de Placas Solares", descricao: "Instala e faz a manutenção de painéis de energia solar, um setor em forte crescimento." },
  { titulo: "Mecânico (veículos/máquinas)", descricao: "Realiza reparos e manutenção em veículos, máquinas agrícolas ou industriais." },
  { titulo: "Montador Industrial", descricao: "Executa a montagem de estruturas e equipamentos em ambientes industriais." },
  { titulo: "Motorista (diversas categorias)", descricao: "Dirige veículos de diferentes portes para transporte de cargas ou passageiros." },
  { titulo: "Operador de Caixa", descricao: "Lida com pagamentos, registra vendas e organiza o caixa em estabelecimentos comerciais." },
  { titulo: "Operador de Máquinas", descricao: "Manuseia equipamentos específicos em fábricas ou na construção civil." },
  { titulo: "Operador de Telemarketing Ativo/Receptivo", descricao: "Realiza chamadas para vendas ou oferece suporte ao cliente por telefone." },
  { titulo: "Pedreiro", descricao: "Profissional da construção civil que realiza alvenaria e outras estruturas." },
  { titulo: "Porteiro", descricao: "Controla o acesso de pessoas e veículos em condomínios, empresas e outros locais." },
  { titulo: "Promotor de Vendas", descricao: "Trabalha na divulgação e demonstração de produtos em pontos de venda." },
  { titulo: "Recepcionista", descricao: "Faz o primeiro atendimento a clientes e visitantes, gerencia agendamentos e correspondências." },
  { titulo: "Repositor de Mercadorias", descricao: "Organiza e abastece prateleiras em supermercados e outras lojas." },
  { titulo: "Serralheiro", descricao: "Profissional que trabalha com metais, fabricando e instalando portas, janelas e estruturas metálicas." },
  { titulo: "Soldador", descricao: "Especialista em unir peças metálicas usando técnicas de soldagem, muito requisitado na indústria." },
  { titulo: "Técnico em Edificações", descricao: "Apoia no planejamento, execução e fiscalização de obras da construção civil." },
  { titulo: "Técnico em Enfermagem", descricao: "Presta cuidados diretos aos pacientes, auxilia médicos e enfermeiros em diversas unidades de saúde." },
  { titulo: "Técnico em Tecnologia da Informação (TI)", descricao: "Oferece suporte técnico, manutenção de redes e hardware, e pode auxiliar na instalação de softwares." },
  { titulo: "Vendedor (loja física)", descricao: "Atende clientes, demonstra produtos e realiza vendas em lojas." },
  { titulo: "Vendedor Externo", descricao: "Prospecção de clientes e vendas fora do estabelecimento comercial." },
  { titulo: "Vigia/Fiscal de Piso", descricao: "Realiza a segurança e o monitoramento de áreas, prevenindo furtos e incidentes." }
];

export default function Home() {
  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [pagina, setPagina] = useState(1);
  const [tema, setTema] = useState<"claro" | "escuro">("claro");
  const [modalVaga, setModalVaga] = useState<{ titulo: string; cidade: string; estado: string } | null>(null);

  useEffect(() => {
    fetch("/Estados.json")
      .then(res => res.json())
      .then(setEstados);
    fetch("/Cidades.json")
      .then(res => res.json())
      .then(setCidades);
  }, []);

  // Mapeia cidades do estado selecionado
  const cidadesDoEstado = useMemo(() => {
    if (!estado) return [];
    return cidades.filter(c => c.Estado === estado);
  }, [estado, cidades]);

  // Gera vagas para todas as cidades do estado selecionado
  const vagasGeradas = useMemo(() => {
    if (!estado) return [];
    return cidadesDoEstado.flatMap(cidade =>
      VAGAS_BASE.map((vaga, idx) => ({
        id: `${cidade.ID}-${idx}`,
        titulo: vaga.titulo,
        descricao: vaga.descricao,
        cidade: cidade.Nome,
        estado: estados.find(e => e.ID === estado)?.Sigla || ""
      }))
    );
  }, [estado, cidadesDoEstado, estados]);

  // Filtro por cidade (se selecionada)
  const vagasFiltradas = cidade
    ? vagasGeradas.filter(v => v.cidade === cidade)
    : vagasGeradas;

  // Paginação
  const vagasPorPagina = 10;
  const totalPaginas = Math.ceil(vagasFiltradas.length / vagasPorPagina);
  const vagasPaginadas = vagasFiltradas.slice(
    (pagina - 1) * vagasPorPagina,
    pagina * vagasPorPagina
  );

  function handleAnterior() {
    setPagina((p) => Math.max(1, p - 1));
  }
  function handleProxima() {
    setPagina((p) => Math.min(totalPaginas, p + 1));
  }

  // Formulário de inscrição
  function FormularioInscricao({
    vaga,
    localizacao,
    onClose,
  }: { vaga: string; localizacao: string; onClose: () => void }) {
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [cpf, setCpf] = useState("");
    const [nascimento, setNascimento] = useState("");
    const [enviado, setEnviado] = useState(false);
    const [erro, setErro] = useState("");

    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      setErro("");
      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("telefone", telefone);
      formData.append("cpf", cpf);
      formData.append("nascimento", nascimento);
      formData.append("vaga", vaga);
      formData.append("localizacao", localizacao);

      const res = await fetch("/api/candidatura", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result.sucesso) {
        setEnviado(true);
        setTimeout(() => {
          setEnviado(false);
          onClose();
        }, 2000);
      } else {
        setErro(result.erro || "Erro ao enviar candidatura.");
      }
    }

    return (
      <div className="nova-modal">
        <form className="nova-form" onSubmit={handleSubmit}>
          <h3>Inscreva-se para: {vaga}</h3>
          <input
            type="text"
            placeholder="Nome completo"
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Whatsapp"
            value={telefone}
            onChange={e => setTelefone(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={e => setCpf(e.target.value)}
            required
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span>Data de nascimento</span>
            <input
              type="date"
              value={nascimento}
              onChange={e => setNascimento(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="nova-btn" disabled={enviado}>
            {enviado ? "✅ Enviado!" : "Enviar candidatura"}
          </button>
          {erro && <div className="nova-form-erro">{erro}</div>}
          <button type="button" className="nova-btn" onClick={onClose} style={{ marginTop: 8 }}>
            Fechar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={`nova-root ${tema}`}>
      <nav className="nova-nav">
        <span className="nova-logo"><span className="nova-logo-accent">JobWave</span></span>
        <button
          className="nova-theme"
          onClick={() => setTema(tema === "claro" ? "escuro" : "claro")}
          aria-label="Alternar tema"
        >
          {tema === "claro" ? "🌞" : "🌚"}
        </button>
      </nav>
      <header className="nova-header">
        <h1>
          <span className="nova-gradient">Encontre vagas</span>
        </h1>
        <p>
          Busque oportunidades reais, destaque-se e conquiste seu próximo passo profissional.
        </p>
        <div className="nova-searchbar">
          <input
            type="text"
            placeholder="Digite cargo, empresa ou cidade..."
            value={""}
            onChange={() => {}}
          />
        </div>
      </header>
      <div className="nova-filtros">
        <select value={estado} onChange={e => { setEstado(e.target.value); setCidade(""); setPagina(1); }}>
          <option value="">Todos os estados</option>
          {estados.map(uf => (
            <option key={uf.ID} value={uf.ID}>{uf.Sigla} - {uf.Nome}</option>
          ))}
        </select>
        <select value={cidade} onChange={e => { setCidade(e.target.value); setPagina(1); }} disabled={!estado}>
          <option value="">Todas as cidades</option>
          {cidadesDoEstado.map(c => (
            <option key={c.ID} value={c.Nome}>{c.Nome}</option>
          ))}
        </select>
      </div>
      <main className="nova-main">
        {vagasPaginadas.length === 0 ? (
          <p className="nova-sem-vagas">Nenhuma vaga encontrada.</p>
        ) : (
          <ul className="nova-lista">
            {vagasPaginadas.map(vaga => (
              <li className="nova-card" key={vaga.id}>
                <div className="nova-card-header">
                  <h2>{vaga.titulo}</h2>
                  <span className="nova-cidade">{vaga.cidade}</span>
                  <span className="nova-empresa">{vaga.estado}</span>
                </div>
                <div className="nova-desc">{vaga.descricao}</div>
                <div className="nova-tags">
                  <span className="nova-tag">Divulgação</span>
                </div>
                <button className="nova-btn" onClick={() => { setModalVaga(vaga); console.log("Abrindo modal", vaga); }}>
                  Inscrever-se
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 16,
        margin: "32px 0",
        position: "relative",
        bottom: 0
      }}>
        <button className="nova-btn" onClick={handleAnterior} disabled={pagina === 1}>
          Página anterior
        </button>
        <span style={{ alignSelf: "center" }}>
          Página {pagina} de {totalPaginas}
        </span>
        <button className="nova-btn" onClick={handleProxima} disabled={pagina === totalPaginas}>
          Próxima página
        </button>
      </div>
      <footer className="nova-footer">
        <span>© {new Date().getFullYear()} JobWave • Todos os direitos reservados</span>
      </footer>
      {modalVaga && (
        <FormularioInscricao
          vaga={modalVaga.titulo}
          localizacao={`${modalVaga.cidade}, ${modalVaga.estado}`}
          onClose={() => setModalVaga(null)}
        />
      )}
    </div>
  );
}