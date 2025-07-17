"use client";
import "./globals.css";
import styles from "./page.module.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>
        {children}
      </body>
    </html>
  );
}