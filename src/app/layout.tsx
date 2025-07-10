import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Emprego Brasil - Vagas de Emprego em Todo o País",
  description:
    "Encontre oportunidades de trabalho em todo o Brasil. Vagas nas cinco regiões, todos os estados e principais cidades do país.",
  keywords: [
    "emprego",
    "vagas",
    "trabalho",
    "brasil",
    "oportunidades",
    "carreira",
  ],
  authors: [{ name: "Emprego Brasil" }],
  creator: "Emprego Brasil",
  publisher: "Emprego Brasil",
  robots: "index, follow",
  openGraph: {
    type: "website",
    title: "Emprego Brasil - Vagas de Emprego em Todo o País",
    description: "Encontre oportunidades de trabalho em todo o Brasil",
    siteName: "Emprego Brasil",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
