import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Footer from "@/components/sections/Footer";
import { Button, Card, CardBody, Eyebrow, Notice } from "@/design-system";
import { resolveOfficialWhatsAppNumber } from "@/lib/funnel/quiz-config";

export const metadata: Metadata = {
  title: { absolute: "Pharmil · Atendimento Oficial e Procedência" },
  description:
    "Canal institucional da Pharmil. Atendimento consultivo, procedência verificada e envio rastreado em todo o Brasil.",
};

const PILLARS = [
  {
    title: "Procedência verificada",
    description:
      "Catálogo padronizado, conferência de lote e informações claras antes da confirmação.",
  },
  {
    title: "Envio com rastreio",
    description:
      "Separação monitorada, cuidado térmico e atualização do código de rastreio diretamente no WhatsApp.",
  },
  {
    title: "Canal oficial único",
    description:
      "Atendimento realizado exclusivamente pelos canais verificados da Pharmil.",
  },
] as const;

export default function InstitucionalPage() {
  const whatsappNumber = resolveOfficialWhatsAppNumber(
    process.env.NEXT_PUBLIC_WHATSAPP_OFFICIAL_NUMBER,
  );
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Olá, Pharmil. Gostaria de receber informações pelo atendimento oficial.",
  )}`;

  return (
    <div className="funnel-institucional">
      <header className="lp-header">
        <Link aria-label="Pharmil" className="lp-header__brand" href="/">
          <span aria-hidden="true" className="brand__logo-crop">
            <Image
              alt=""
              className="brand__logo"
              height={1254}
              sizes="60px"
              src="/brand/pharmil-logo.png"
              width={1254}
            />
          </span>
        </Link>
        <Button
          href={whatsappHref}
          rel="noopener noreferrer"
          size="sm"
          target="_blank"
        >
          Atendimento oficial
        </Button>
      </header>

      <main className="funnel-institucional__main" id="conteudo">
        <section className="funnel-institucional__hero">
          <Eyebrow tone="wine">Pharmil Oficial</Eyebrow>
          <h1 className="funnel-institucional__title">
            Atendimento consultivo e transparência em cada etapa do pedido
          </h1>
          <p className="funnel-institucional__lede">
            A equipe Pharmil realiza atendimento direto pelo canal oficial de WhatsApp,
            com orientação clara sobre catálogo, envio rastreado e suporte pós-compra.
          </p>
          <div className="funnel-institucional__cta">
            <Button
              href={whatsappHref}
              rel="noopener noreferrer"
              target="_blank"
            >
              Falar no WhatsApp (48) 99115-3151
            </Button>
          </div>
        </section>

        <section
          aria-label="Pilares operacionais"
          className="funnel-institucional__pillars"
        >
          {PILLARS.map((pillar) => (
            <Card key={pillar.title}>
              <CardBody>
                <div className="funnel-pillar__body">
                  <h2 className="lp-card__title">{pillar.title}</h2>
                  <p className="funnel-pillar__text">{pillar.description}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </section>

        <section className="funnel-institucional__notice">
          <Notice title="Privacidade e proteção de dados (LGPD)" tone="info">
            Os dados informados nos canais oficiais são utilizados exclusivamente para
            atendimento, processamento logístico e suporte ao cliente.
          </Notice>
        </section>
      </main>

      <Footer contactHref={whatsappHref} />
    </div>
  );
}
