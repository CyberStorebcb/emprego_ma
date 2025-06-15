"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../page.module.css";

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

// Gerar vagas básicas
const vagasBasico: Job[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  title: titulosBasico[i % titulosBasico.length],
  company: empresas[i % empresas.length],
  location: cidades[i % cidades.length],
  description: "Vaga para nível básico. Não exige experiência prévia.",
  link: `https://example.com/vaga-basica-${i + 1}`,
  level: "Júnior",
  remote: Math.random() < 0.3,
  salary: Math.floor(1200 + Math.random() * 400), // até 1600
  education: "Básico",
}));

// Gerar vagas médias
const vagasMedio: Job[] = Array.from({ length: 60 }, (_, i) => ({
  id: 31 + i,
  title: titulosMedio[i % titulosMedio.length],
  company: empresas[(i + 3) % empresas.length],
  location: cidades[(i + 2) % cidades.length],
  description: "Vaga para nível médio. Experiência desejável.",
  link: `https://example.com/vaga-medio-${i + 1}`,
  level: i % 2 === 0 ? "Júnior" : "Pleno",
  remote: Math.random() < 0.4,
  salary: Math.floor(1600 + Math.random() * 400), // até 2000
  education: "Médio",
}));

// Gerar vagas superiores
const vagasSuperior: Job[] = Array.from({ length: 10 }, (_, i) => ({
  id: 91 + i,
  title: titulosSuperior[i % titulosSuperior.length],
  company: empresas[(i + 5) % empresas.length],
  location: cidades[(i + 4) % cidades.length],
  description: "Vaga para nível superior. Exige formação e experiência comprovada.",
  link: `https://example.com/vaga-superior-${i + 1}`,
  level: i % 2 === 0 ? "Pleno" : "Sênior",
  remote: Math.random() < 0.5,
  salary: Math.floor(8000 + Math.random() * 7000), // até 15000
  education: "Superior",
}));

const jobs: Job[] = [...vagasBasico, ...vagasMedio, ...vagasSuperior];

const allCities = Array.from(new Set(jobs.map((j) => j.location))).sort();
const allLevels = Array.from(new Set(jobs.map((j) => j.level)));

export default function Vagas() {
  const [search, setSearch] = useState("");
  const [onlyRemote, setOnlyRemote] = useState(false);
  const [city, setCity] = useState("");
  const [level, setLevel] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Tema
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDark(true);
    if (saved === "light") setDark(false);
  }, []);
  useEffect(() => {
    if (dark) {
      document.body.classList.add("darkMode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("darkMode");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // Filtro dinâmico
  const filteredJobs = jobs.filter(
    (job) =>
      (!onlyRemote || job.remote) &&
      (!city || job.location === city) &&
      (!level || job.level === level) &&
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

  if (!mounted) return null; // Evita hydration mismatch

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <nav aria-label="Navegação secundária">
          <ul className={styles.navList}>
            <li>
              <Link href="/" className={styles.secondary}>
                Início
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <section className={styles.jobsBar}>
        <input
          type="text"
          placeholder="Buscar vaga, empresa ou cidade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.jobsSearch}
          aria-label="Buscar vaga"
        />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={styles.jobsSearch}
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
          className={styles.jobsSearch}
          aria-label="Filtrar por nível"
        >
          <option value="">Todos níveis</option>
          {allLevels.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <label className={styles.jobsCheckboxLabel}>
          <input
            type="checkbox"
            checked={onlyRemote}
            onChange={() => setOnlyRemote((v) => !v)}
            className={styles.jobsCheckbox}
          />
          Apenas remoto
        </label>
      </section>
      <main id="conteudo-principal" tabIndex={-1} className={styles.jobsMain}>
        <h1 className={styles.title}>Vagas de Emprego no Maranhão</h1>
        <div style={{ marginBottom: 16, fontWeight: 500 }}>
          {filteredJobs.length} vaga
          {filteredJobs.length !== 1 && "s"} encontrada
          {filteredJobs.length !== 1 && "s"}
        </div>
        <ul aria-label="Lista de vagas" className={styles.jobsGrid}>
          {filteredJobs.length === 0 && (
            <li className={styles.noJobs}>
              <p>Nenhuma vaga encontrada.</p>
            </li>
          )}
          {filteredJobs.map((job) => (
            <li key={job.id} className={styles.jobCard} tabIndex={0}>
              <div className={styles.jobCardHeader}>
                <h2 className={styles.jobTitle}>{job.title}</h2>
                <div>
                  <span className={`${styles.badge} ${styles.badgeLevel}`}>
                    {job.level}
                  </span>
                  {job.remote && (
                    <span className={`${styles.badge} ${styles.badgeRemote}`}>
                      Remoto
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.jobInfo}>
                <span className={styles.jobCompany}>{job.company}</span>
                <span className={styles.jobLocation}>{job.location}</span>
              </div>
              <p className={styles.jobDesc}>{job.description}</p>
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <a
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.jobDetailsBtn}
                  aria-label={`Ver detalhes da vaga para ${job.title} na empresa ${job.company}`}
                >
                  Ver detalhes
                </a>
                <button
                  className={styles.jobDetailsBtn}
                  style={{ background: "#fbbf24", color: "#22223b" }}
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
      <footer className={styles.footer}>
        <p>
          <small>© {new Date().getFullYear()} Emprego MA</small>
        </p>
      </footer>
    </div>
  );
}