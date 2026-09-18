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
    default: "Pharmil | Peptídeos injetáveis de alta pureza",
    template: "%s | Pharmil",
  },
  description:
    "Laudo de análise por lote, envio entre 2 e 8 °C e rastreio no mesmo dia. Dispensação por farmácia parceira habilitada, mediante prescrição.",
  openGraph: {
    title: "Pharmil | Peptídeos injetáveis de alta pureza",
    description:
      "Laudo por lote, cadeia de frio e rastreio informados antes de você confirmar.",
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
