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
    default: "Pharmil | Consultoria farmacêutica e logística",
    template: "%s | Pharmil",
  },
  description:
    "Intermediamos o atendimento entre você e farmácias parceiras habilitadas, com conformidade verificada e entrega acompanhada.",
  openGraph: {
    title: "Pharmil | Consultoria farmacêutica e logística",
    description:
      "Atendimento orientado, conformidade verificada e entrega acompanhada.",
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
