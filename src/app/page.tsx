"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  const [dark, setDark] = useState(false);

  // Carrega a preferência do usuário ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDark(true);
    if (saved === "light") setDark(false);
  }, []);

  // Aplica a classe e salva a preferência
  useEffect(() => {
    if (dark) {
      document.body.classList.add("darkMode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("darkMode");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <div className={styles.page}>
      <div className={styles.bgParticles} aria-hidden="true">
        <div className={`${styles.particle} ${styles.particle1}`}></div>
        <div className={`${styles.particle} ${styles.particle2}`}></div>
        <div className={`${styles.particle} ${styles.particle3}`}></div>
        <div className={`${styles.particle} ${styles.particle4}`}></div>
        <div className={`${styles.particle} ${styles.particle5}`}></div>
      </div>
      <header className={styles.header}>
        <nav aria-label="Navegação principal">
          <ul className={styles.navList}>
            <li>
              <Link href="/vagas" className={`${styles.link} ${styles.primary}`}>
                Ver vagas de emprego
              </Link>
            </li>
            <li>
              <button
                className={styles.toggle}
                onClick={() => setDark((v) => !v)}
                aria-label="Alternar modo claro/escuro"
              >
                {dark ? (
                  <svg
                    className={`${styles.themeIcon} ${styles.rotate}`}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
                      fill="#fbbf24"
                    />
                  </svg>
                ) : (
                  <svg className={styles.themeIcon} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="5" fill="#fbbf24" />
                    <g stroke="#fbbf24" strokeWidth="2">
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
              </button>
            </li>
          </ul>
        </nav>
      </header>
      <main className={styles.main} id="conteudo-principal" tabIndex={-1}>
        <h1 className={styles.title}>
          Bem-vindo ao{" "}
          <span style={{ color: "#2563eb" }}>Emprego MA</span>
        </h1>
        <p className={styles.text}>
          Encontre oportunidades de trabalho no Maranhão de forma simples,
          acessível e moderna.
        </p>
        <div className={styles.ctas}>
          <Link href="/vagas" className={`${styles.link} ${styles.primary}`}>
            Acessar vagas
          </Link>
        </div>
      </main>
      <footer className={styles.footer}>
        <p>
          <small>
            © {new Date().getFullYear()} Emprego MA — Feito com Next.js
          </small>
        </p>
      </footer>
    </div>
  );
}
