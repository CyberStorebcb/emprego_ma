"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import useTheme from "./useTheme";
import React from "react";

export default function Home() {
  const { dark, setDark, mounted } = useTheme();
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const knobRef = useRef<HTMLSpanElement>(null);

  // Lógica de arrastar
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
    let x = clientX - rect.left - 12; // 12 = metade da largura do botão
    x = Math.max(0, Math.min(x, 26)); // Limita de 0 a 26px
    setDragX(x);
  }
  function onDragEnd() {
    if (!dragging) return;
    setDragging(false);
    document.body.style.userSelect = "";
    setDark(dragX > 13 ? true : false);
    setDragX(0);
  }
  // Eventos de arrastar
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

  if (!mounted) return null; // Evita hydration mismatch

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
          </ul>
        </nav>
        {/* Switch arrastável */}
        <button
          className={`${styles.themeSwitch} ${dark ? "dark" : ""}`}
          aria-label="Alternar modo claro/escuro"
          type="button"
          tabIndex={0}
          onClick={() => setDark((v: any) => !v)}
          style={{ touchAction: "none" }}
        >
          <span
            ref={knobRef}
            className={styles.themeSwitchKnob}
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
                className={styles.themeSwitchIcon}
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
                className={styles.themeSwitchIcon}
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
      <main className={styles.main} id="conteudo-principal" tabIndex={-1}>
        <h1 className={styles.title}>
          Bem-vindo ao{" "}
          <span style={{ color: "#2563eb" }}>Emprego Brasil</span>
        </h1>
        <p className={styles.text}>
          Encontre oportunidades de trabalho em todo o Brasil de forma simples,
          acessível e moderna. Vagas em todas as capitais e principais cidades.
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
            © {new Date().getFullYear()} Emprego Brasil — Conectando talentos em todo o país
          </small>
        </p>
      </footer>
    </div>
  );
}
