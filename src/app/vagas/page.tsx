"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import useTheme from "../useTheme";
import "./vagas.css";
import React from "react";

// Estrutura base para vagas (mantém interface Job, mas não gera vagas)
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

// Não gera vagas
function gerarVagasBrasil(): Job[] {
  return [];
}

export default function Vagas() {
  const { dark, setDark, mounted } = useTheme();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState<Job | null>(null);

  // Vagas (vazio)
  const jobs = useMemo(() => gerarVagasBrasil(), []);
  const filteredJobs = useMemo(() => jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase())
  ), [jobs, search]);

  if (!mounted) return null;

  return (
    <div className={`vagas-root-new ${dark ? "darkMode" : ""}`}>
      {/* Header */}
      <header className="vagas-header-new">
        <Link href="/" className="vagas-logo-new">
          <span>
            <b>emprego</b>
            <span style={{ color: dark ? "#fbbf24" : "#2563eb" }}>.ma</span>
          </span>
        </Link>
        <nav>
          <Link href="/" className="vagas-navlink-new">Início</Link>
          <Link href="/vagas" className="vagas-navlink-new active">Vagas</Link>
          <a href="mailto:contato@empregobrasil.com" className="vagas-navlink-new">Contato</a>
        </nav>
        <button
          className="themeSwitch-new"
          aria-label={dark ? "Modo claro" : "Modo escuro"}
          onClick={() => setDark((v: boolean) => !v)}
        >
          {dark ? "🌙" : "☀️"}
        </button>
      </header>

      {/* Hero */}
      <section className="vagas-hero-new">
        <h1>
          <span role="img" aria-label="Busca">🔍</span> Encontre seu próximo <span className="gradient-text">emprego</span>
        </h1>
        <p>
          Oportunidades reais, experiência única.<br />
          <span className="gradient-text">Cadastre-se</span> e seja notificado!
        </p>
        <div className="vagas-searchbar-new">
          <input
            type="text"
            placeholder="Busque por cargo, empresa ou cidade..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Buscar vaga"
          />
        </div>
      </section>

      {/* Grid de vagas */}
      <main className="vagas-main-new">
        <div className="vagas-count-new">
          <span>
            {filteredJobs.length === 0
              ? "Nenhuma vaga disponível no momento."
              : `${filteredJobs.length} vagas encontradas`}
          </span>
        </div>
        <ul className="vagas-list-new">
          {filteredJobs.length === 0 && (
            <li className="vagas-nojobs-new">
              <span role="img" aria-label="Sem vagas">😕</span>
              <p>Nenhuma vaga disponível. Cadastre-se para ser avisado!</p>
            </li>
          )}
          {filteredJobs.map((job) => (
            <li key={job.id} className={`vagas-card-new ${job.featured ? "featured" : ""}`}>
              <div className="vagas-card-header-new">
                <h2>{job.title}</h2>
                <span className="vagas-company-new">{job.company}</span>
                <span className="vagas-location-new">{job.location}</span>
              </div>
              <div className="vagas-card-desc-new">{job.description}</div>
              <div className="vagas-card-actions-new">
                <button className="vagas-btn-new" onClick={() => setShowModal(job)}>
                  Ver detalhes
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>

      {/* Modal de candidatura */}
      {showModal && (
        <div className="vagas-modal-bg-new" role="dialog" aria-modal="true" tabIndex={-1} onClick={() => setShowModal(null)}>
          <div className="vagas-modal-new" onClick={e => e.stopPropagation()}>
            <button className="vagas-modal-close-new" aria-label="Fechar" onClick={() => setShowModal(null)}>×</button>
            <h2>{showModal.title}</h2>
            <p className="vagas-modal-company">{showModal.company} • {showModal.location}</p>
            <div className="vagas-modal-desc">{showModal.description}</div>
            <hr />
            <h3>Candidate-se</h3>
            <CandidateForm jobTitle={showModal.title} jobLocation={showModal.location} dark={dark} />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="vagas-footer-new">
        <div>
          <a href="mailto:contato@empregobrasil.com">Contato</a>
          <a href="/sobre">Sobre</a>
          <a href="/privacidade">Privacidade</a>
        </div>
        <small>
          © {new Date().getFullYear()} emprego.ma • Todos os direitos reservados
        </small>
      </footer>
    </div>
  );
}

// Formulário minimalista
function CandidateForm({ jobTitle, jobLocation, dark }: { jobTitle: string; jobLocation: string; dark: boolean }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [enviado, setEnviado] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviado(true);

    await fetch("/api/candidatura", {
      method: "POST",
      body: new FormData(e.target as HTMLFormElement),
    });

    setTimeout(() => setEnviado(false), 2500);
  }

  return (
    <form className="vagas-form-new" onSubmit={handleSubmit}>
      <input
        type="text"
        name="nome"
        placeholder="Seu nome completo"
        value={nome}
        onChange={e => setNome(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Seu e-mail"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="tel"
        name="telefone"
        placeholder="WhatsApp"
        value={telefone}
        onChange={e => setTelefone(e.target.value)}
        required
      />
      <input
        type="text"
        name="cpf"
        placeholder="CPF 000.000.000-00"
        value={cpf}
        onChange={e => setCpf(e.target.value)}
        required
      />
      <input
        type="text"
        name="nascimento"
        placeholder="Data de nascimento"
        value={nascimento}
        onChange={e => setNascimento(e.target.value)}
        required
      />
      <button type="submit" className="vagas-btn-new" disabled={enviado}>
        {enviado ? "✅ Enviado!" : "Enviar candidatura"}
      </button>
      {enviado && (
        <div className="vagas-form-success">
          Obrigado! Recebemos sua candidatura.
        </div>
      )}
    </form>
  );
}