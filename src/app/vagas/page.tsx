"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import useTheme from "../useTheme";
import "./vagas.css";
import React from "react";

type Job = {
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
};

const cidades = [
  "São Luís, MA",
  "Imperatriz, MA",
  "Caxias, MA",
  "Balsas, MA",
  "Açailândia, MA",
  "Bacabal, MA",
  "Timon, MA",
  "Chapadinha, MA",
  "Barra do Corda, MA",
  "Santa Inês, MA",
];
const empresas = [
  "Tech Solutions",
  "Data Corp",
  "Agência Criativa",
  "InfoHelp",
  "Soluções Web",
  "Maranhão RH",
  "Grupo Maranhão",
  "MA Digital",
  "Serviços Gerais MA",
  "EducaMais",
];
const titulosBasico = [
  "Auxiliar de Serviços Gerais",
  "Atendente",
  "Repositor",
  "Operador de Caixa",
  "Auxiliar de Limpeza",
  "Recepcionista",
  "Auxiliar Administrativo",
  "Estoquista",
  "Zelador",
  "Auxiliar de Cozinha",
];
const titulosMedio = [
  "Assistente Administrativo",
  "Vendedor",
  "Técnico em Informática",
  "Técnico em Enfermagem",
  "Motorista",
  "Auxiliar de RH",
  "Técnico de Segurança",
  "Técnico em Logística",
  "Técnico em Edificações",
  "Técnico em Contabilidade",
];
const titulosSuperior = [
  "Engenheiro Civil",
  "Médico",
  "Advogado",
  "Analista de Sistemas",
  "Desenvolvedor Sênior",
  "Gerente de Projetos",
  "Farmacêutico",
  "Professor Universitário",
  "Arquiteto",
  "Administrador",
];

// Geração de vagas variadas
const allTitles = [
  ...titulosBasico,
  ...titulosMedio,
  ...titulosSuperior,
];
const allEducations = ["Básico", "Médio", "Superior"];
const allLevelsList = ["Júnior", "Pleno", "Sênior"];

function randomFrom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const jobs: Job[] = Array.from({ length: 500 }, (_, i) => {
  const education = randomFrom(allEducations);
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
  return {
    id: i + 1,
    title,
    company: randomFrom(empresas),
    location: randomFrom(cidades),
    description:
      education === "Básico"
        ? "Vaga para nível básico. Não exige experiência prévia."
        : education === "Médio"
        ? "Vaga para nível médio. Experiência desejável."
        : "Vaga para nível superior. Exige formação e experiência comprovada.",
    link: `https://example.com/vaga-${i + 1}`,
    level,
    remote: Math.random() < 0.35,
    salary:
      education === "Básico"
        ? Math.floor(1200 + Math.random() * 600)
        : education === "Médio"
        ? Math.floor(1600 + Math.random() * 1200)
        : Math.floor(3500 + Math.random() * 9000),
    education: education as Job["education"],
  };
});

const allCities = Array.from(new Set(jobs.map((j) => j.location))).sort();
const allLevels = Array.from(new Set(jobs.map((j) => j.level)));

export default function Vagas() {
  const [search, setSearch] = useState("");
  const [onlyRemote, setOnlyRemote] = useState(false);
  const [city, setCity] = useState("");
  const [level, setLevel] = useState("");
  const [education, setEducation] = useState("");
  const [salary, setSalary] = useState(0);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<Job | null>(null);
  const { dark, setDark, mounted } = useTheme();
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const knobRef = useRef<HTMLSpanElement>(null);

  // Filtro dinâmico
  const filteredJobs = jobs.filter(
    (job) =>
      (!onlyRemote || job.remote) &&
      (!city || job.location === city) &&
      (!level || job.level === level) &&
      (!education || job.education === education) &&
      (salary === 0 || job.salary >= salary) &&
      (job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.location.toLowerCase().includes(search.toLowerCase()))
  );

  // Copiar link da vaga
  function handleCopy(link: string, id: number) {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  // Drag logic igual ao da Home
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
    <div className="vagas-root">
      <header className="vagas-header">
        <div className="vagas-header-content">
          <Link href="/" className="vagas-logo">
            <span>
              Emprego<span style={{ color: "#2563eb" }}>MA</span>
            </span>
          </Link>
          <nav>
            <Link href="/" className="vagas-navlink">
              Início
            </Link>
            <Link href="/vagas" className="vagas-navlink active">
              Vagas
            </Link>
            <a
              href="mailto:contato@empregoma.com"
              className="vagas-navlink"
            >
              Contato
            </a>
          </nav>
        </div>
        {/* Switch arrastável */}
        <button
          className={`themeSwitch${dark ? " dark" : ""}`}
          aria-label="Alternar modo claro/escuro"
          type="button"
          tabIndex={0}
          onClick={() => setDark((v: boolean) => !v)}
          style={{ touchAction: "none", position: "absolute", top: 18, right: 32 }}
        >
          <span
            ref={knobRef}
            className="themeSwitchKnob"
            style={{
              transform: dragging
                ? `translateX(${dragX}px)`
                : dark
                ? "translateX(26px)"
                : "translateX(2px)",
              transition: dragging ? "none" : undefined,
              cursor: dragging ? "grabbing" : "grab",
            }}
            onMouseDown={onDragStart}
            onTouchStart={onDragStart}
            aria-hidden="true"
          >
            {dark ? (
              <svg
                className="themeSwitchIcon"
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
                  fill="#232946"
                />
              </svg>
            ) : (
              <svg
                className="themeSwitchIcon"
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle cx="12" cy="12" r="5" fill="#fff" />
                <g stroke="#fff" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </g>
              </svg>
            )}
          </span>
        </button>
      </header>

      <section className="vagas-hero">
        <h1>
          Encontre <span>vagas</span> no Maranhão
        </h1>
        <p>
          Busque oportunidades por cidade, nível, escolaridade ou salário.
          <br />
          <strong>Clique em "Ver detalhes" para saber mais e se candidatar.</strong>
        </p>
      </section>

      <section className="vagas-filtros">
        <input
          type="text"
          placeholder="🔎 Buscar vaga, empresa ou cidade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar vaga"
          style={{ minWidth: 260, maxWidth: 340, width: "100%" }}
        />
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
        <label className="vagas-checkbox">
          <input
            type="checkbox"
            checked={onlyRemote}
            onChange={() => setOnlyRemote((v) => !v)}
          />
          Remoto
        </label>
        <label className="vagas-checkbox" style={{ minWidth: 120 }}>
          Salário mínimo:
          <input
            type="number"
            min={0}
            max={15000}
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
            {filteredJobs.length} vaga
            {filteredJobs.length !== 1 && "s"} encontrada
            {filteredJobs.length !== 1 && "s"}
          </span>
        </div>
        <ul className="vagas-list">
          {filteredJobs.length === 0 && (
            <li className="vagas-nojobs">
              <span role="img" aria-label="Sem vagas">
                😕
              </span>
              <p>Nenhuma vaga encontrada.</p>
            </li>
          )}
          {filteredJobs.map((job) => (
            <li key={job.id} className="vagas-card">
              <div className="vagas-card-header">
                <h2>{job.title}</h2>
                <div className="vagas-badges">
                  {isProgrammerJob(job.title) && (
                    <span className={`vagas-badge vagas-badge-${job.level.toLowerCase()}`}>
                      {job.level}
                    </span>
                  )}
                  {job.remote && isRemoteAllowed(job.title) && (
                    <span className="vagas-badge vagas-badge-remote">Remoto</span>
                  )}
                </div>
              </div>
              <div className="vagas-card-meta">
                <span>🏢 {job.company}</span>
                <span>📍 {job.location}</span>
              </div>
              <div className="vagas-card-desc">{job.description}</div>
              <div className="vagas-card-info">
                <span>🎓 {job.education}</span>
                <span>
                  💰 R${" "}
                  {job.salary.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="vagas-card-actions">
                <button
                  className="vagas-btn"
                  aria-label={`Ver detalhes da vaga para ${job.title} na empresa ${job.company}`}
                  onClick={() => setShowModal(job)}
                >
                  Ver detalhes
                </button>
                <button
                  className="vagas-btn vagas-btn-yellow"
                  onClick={() => handleCopy(job.link, job.id)}
                  aria-label="Copiar link da vaga"
                >
                  {copiedId === job.id ? "Link copiado!" : "Copiar link"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>

      <footer className="vagas-footer">
        <div>
          <a href="mailto:contato@empregoma.com">Contato</a>
          <a href="/sobre">Sobre</a>
          <a href="/privacidade">Privacidade</a>
        </div>
        <small>© {new Date().getFullYear()} Emprego MA</small>
      </footer>

      {showModal && (
        <div
          className="vagas-modal-bg"
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          onClick={() => setShowModal(null)}
        >
          <div className="vagas-modal" onClick={e => e.stopPropagation()}>
            <button
              className="vagas-modal-close"
              aria-label="Fechar detalhes"
              onClick={() => setShowModal(null)}
            >
              ×
            </button>
            <h2 style={{ color: "#2563eb", marginBottom: 12 }}>{showModal.title}</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: 18 }}>
              <li><strong>Empresa:</strong> {showModal.company}</li>
              <li><strong>Cidade:</strong> {showModal.location}</li>
              <li><strong>Nível:</strong> {showModal.level}</li>
              <li><strong>Escolaridade:</strong> {showModal.education}</li>
              <li><strong>Salário:</strong> R$ {showModal.salary.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</li>
            </ul>
            <p style={{ marginBottom: 18 }}>
              <strong>Descrição:</strong> {showModal.description}
            </p>

            <hr style={{ margin: "18px 0" }} />

            <h3 style={{ fontSize: "1.1rem", marginBottom: 10, color: "#2563eb" }}>Candidatar-se para esta vaga</h3>
            <CandidateForm jobTitle={showModal.title} />
          </div>
        </div>
      )}
    </div>
  );
}

function CandidateForm({ jobTitle }: { jobTitle: string }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [curriculo, setCurriculo] = useState<File | null>(null);
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviado(true);
    setTimeout(() => setEnviado(false), 2500);
    // Aqui você pode integrar com backend ou serviço de e-mail
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <input
        type="text"
        placeholder="Seu nome completo"
        value={nome}
        onChange={e => setNome(e.target.value)}
        required
        style={{ padding: 8, borderRadius: 6, border: "1.5px solid #2563eb" }}
      />
      <input
        type="email"
        placeholder="Seu e-mail"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{ padding: 8, borderRadius: 6, border: "1.5px solid #2563eb" }}
      />
      <input
        type="tel"
        placeholder="Seu Whatsapp"
        value={telefone}
        onChange={e => setTelefone(e.target.value)}
        style={{ padding: 8, borderRadius: 6, border: "1.5px solid #2563eb" }}
      />
      <input
        type="text"
        placeholder="CPF"
        value={cpf}
        onChange={e => setCpf(e.target.value)}
        required
        maxLength={14}
        style={{ padding: 8, borderRadius: 6, border: "1.5px solid #2563eb" }}
      />
      <input
        type="date"
        placeholder="Data de nascimento"
        value={nascimento}
        onChange={e => setNascimento(e.target.value)}
        required
        style={{ padding: 8, borderRadius: 6, border: "1.5px solid #2563eb" }}
      />
      <label style={{ fontWeight: 500, color: "#2563eb" }}>
        Anexe seu currículo:
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={e => setCurriculo(e.target.files?.[0] || null)}
          required
          style={{ marginTop: 4 }}
        />
      </label>
      <button
        type="submit"
        className="vagas-btn"
        style={{ marginTop: 8, fontWeight: 700 }}
        disabled={enviado}
      >
        {enviado ? "Enviado!" : `Enviar candidatura`}
      </button>
      {enviado && (
        <span style={{ color: "#22c55e", fontWeight: 600, marginTop: 4 }}>
          Candidatura enviada com sucesso!
        </span>
      )}
    </form>
  );
}

function isProgrammerJob(title: string) {
  const keywords = [
    "Desenvolvedor",
    "Programador",
    "Analista de Sistemas",
    "Engenheiro de Software",
    "Full Stack",
    "Frontend",
    "Backend",
    "DevOps",
    "Mobile",
    "Software"
  ];
  return keywords.some((kw) => title.toLowerCase().includes(kw.toLowerCase()));
}

function isRemoteAllowed(title: string) {
  // Adicione aqui todos os cargos que podem ser remotos
  const remoteKeywords = [
    "Desenvolvedor",
    "Programador",
    "Analista de Sistemas",
    "Engenheiro de Software",
    "Full Stack",
    "Frontend",
    "Backend",
    "DevOps",
    "Mobile",
    "Software",
    "Designer",
    "Suporte Técnico",
    "Analista"
  ];
  return remoteKeywords.some((kw) => title.toLowerCase().includes(kw.toLowerCase()));
}