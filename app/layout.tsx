import type { Metadata } from "next";
import localFont from "next/font/local";

import { getSiteUrl } from "@/lib/site-config";

import "./globals.css";

const brandFont = localFont({
  src: [{ path: "./fonts/Archivo-Variable.ttf", weight: "100 900" }],
  variable: "--font-brand",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "Pharmil · Saúde, Rotina e Hábitos Saudáveis",
    template: "%s | Pharmil",
  },
  description:
    "Portal institucional dedicado à organização de rotina, hábitos saudáveis, bem-estar e informações claras com responsabilidade.",
  openGraph: {
    title: "Pharmil · Saúde, Rotina e Hábitos Saudáveis",
    description:
      "Organização de rotina, hábitos saudáveis e informações claras com responsabilidade.",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Pharmil · Saúde, Rotina e Hábitos Saudáveis",
    description:
      "Organização de rotina, hábitos saudáveis e informações claras com responsabilidade.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={brandFont.variable}>
      <body>{children}</body>
    </html>
  );
}
