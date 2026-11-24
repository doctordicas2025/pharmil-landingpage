import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  ChatBubbleIcon,
  ColdChainIcon,
  PackageTrackIcon,
  ShieldIcon,
} from "@/components/funnel/FunnelIcons";
import Footer from "@/components/sections/Footer";
import { Button, Card, CardBody, DotPill, Eyebrow, IconBox, Notice, Stat } from "@/design-system";
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
    icon: <ShieldIcon size={18} strokeWidth={2.2} />,
    tone: "wine",
  },
  {
    title: "Cuidado térmico 2–8 °C",
    description:
      "Separação monitorada em caixa térmica lacrada para preservar estabilidade durante o trajeto.",
    icon: <ColdChainIcon size={18} strokeWidth={2.2} />,
    tone: "navy",
  },
  {
    title: "Envio 100% rastreado",
    description:
      "Lacre numerado e atualização do código de rastreio diretamente pelo canal oficial no WhatsApp.",
    icon: <PackageTrackIcon size={18} strokeWidth={2.2} />,
    tone: "orange",
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
          <ChatBubbleIcon size={16} strokeWidth={2.4} />
          Atendimento oficial
        </Button>
      </header>

      <main id="conteudo">
        <section className="funnel-institucional__band">
          <div aria-hidden="true" className="funnel-page__halo" />
          <div className="funnel-institucional__main">
            <div className="funnel-institucional__hero">
              <DotPill>Pharmil Oficial · Canal verificado</DotPill>
              <h1 className="funnel-institucional__title">
                Atendimento consultivo e transparência em cada etapa do pedido
              </h1>
              <p className="funnel-institucional__lede">
                A equipe Pharmil realiza atendimento direto pelo canal oficial de
                WhatsApp, com orientação clara sobre catálogo, cadeia fria, envio
                rastreado e suporte pós-compra.
              </p>
              <div className="funnel-institucional__cta">
                <Button
                  href={whatsappHref}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <ChatBubbleIcon size={18} strokeWidth={2.5} />
                  Falar no WhatsApp (48) 99115-3151
                </Button>
              </div>
            </div>

            <section
              aria-label="Pilares operacionais"
              className="funnel-institucional__pillars"
            >
              {PILLARS.map((pillar) => (
                <Card key={pillar.title}>
                  <CardBody>
                    <div className="funnel-pillar__body">
                      <IconBox>
                        <span
                          className={`funnel-trust__icon funnel-trust__icon--${pillar.tone}`}
                        >
                          {pillar.icon}
                        </span>
                      </IconBox>
                      <h2 className="lp-card__title">{pillar.title}</h2>
                      <p className="funnel-pillar__text">{pillar.description}</p>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </section>
          </div>
        </section>

        <section aria-labelledby="inst-proof-title" className="lp-proof">
          <div className="lp-proof__inner">
            <div>
              <Eyebrow tone="orange">Compromisso operacional</Eyebrow>
              <h2 className="section-title lp-proof__title" id="inst-proof-title">
                Processo documentado do estoque à entrega.
              </h2>
              <p className="lp-proof__lede">
                Conferência dupla de lote e temperatura, caixa térmica lacrada e
                suporte humano em todas as etapas.
              </p>
            </div>
            <ul className="lp-stats">
              <li>
                <Stat
                  detail="faixa térmica monitorada no envio"
                  onDark
                  value="2–8 °C"
                />
              </li>
              <li>
                <Stat
                  detail="autonomia da embalagem em rotas longas"
                  onDark
                  value="48h"
                />
              </li>
              <li>
                <Stat
                  detail="dos pedidos com lacre e código de rastreio"
                  onDark
                  value="100%"
                />
              </li>
            </ul>
          </div>
        </section>

        <div className="funnel-institucional__main">
          <Notice title="Privacidade e proteção de dados (LGPD)" tone="info">
            Os dados informados nos canais oficiais são utilizados exclusivamente para
            atendimento, processamento logístico e suporte ao cliente.
          </Notice>
        </div>
      </main>

      <Footer contactHref={whatsappHref} />
    </div>
  );
}
