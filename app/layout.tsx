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
    default: "Pharmil | Procedência em cada etapa",
    template: "%s | Pharmil",
  },
  description:
    "Conheça as linhas Pharmil e entenda como funcionam o atendimento, o acondicionamento e o rastreio do pedido.",
  openGraph: {
    title: "Pharmil | Procedência em cada etapa",
    description:
      "Produtos selecionados, acondicionamento cuidadoso e entrega acompanhada.",
    locale: "pt_BR",
    type: "website",
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
