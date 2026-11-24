import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  ChatBubbleIcon,
  ColdChainIcon,
  PackageTrackIcon,
  ShieldIcon,
} from "@/components/funnel/FunnelIcons";
import { Button, DotPill, Eyebrow, IconBox, Stat } from "@/design-system";
import {
  buildDirectWhatsAppUrl,
  resolveVipGroupInviteUrl,
} from "@/lib/funnel/quiz-config";

export const metadata: Metadata = {
  title: { absolute: "Pharmil · Grupo VIP Oficial" },
  description:
    "Acesso direto ao Grupo VIP oficial da Pharmil no WhatsApp com avisos de lote, condições de cliente e suporte da equipe.",
  robots: { index: false, follow: false },
};

const VIP_HIGHLIGHTS = [
  {
    title: "Condição de cliente e avisos de lote",
    detail: "Chegada de lote novo, validade e tabela atualizada primeiro no grupo.",
    icon: <PackageTrackIcon size={18} strokeWidth={2.2} />,
    tone: "orange",
  },
  {
    title: "Laudo e procedência à vista",
    detail: "Cada lote publicado com conferência de pureza e envio entre 2 e 8 °C.",
    icon: <ColdChainIcon size={18} strokeWidth={2.2} />,
    tone: "navy",
  },
  {
    title: "Suporte direto com a equipe",
    detail: "Atendimento humano pelo canal oficial da Pharmil, sem robô e sem fila.",
    icon: <ShieldIcon size={18} strokeWidth={2.2} />,
    tone: "wine",
  },
] as const;

export default function VipPage() {
  const vipGroupUrl = resolveVipGroupInviteUrl(
    process.env.NEXT_PUBLIC_WHATSAPP_VIP_GROUP_URL,
  );
  const directWhatsappUrl = buildDirectWhatsAppUrl(
    process.env.NEXT_PUBLIC_WHATSAPP_OFFICIAL_NUMBER,
  );

  return (
    <div className="funnel-page funnel-vip">
      <div aria-hidden="true" className="funnel-page__halo" />

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
        <span className="lp-header__note">Grupo VIP Oficial</span>
      </header>

      <main id="conteudo">
        <section aria-labelledby="vip-title" className="funnel-vip__hero">
          <div className="funnel-vip__grid">
            <div className="funnel-vip__copy">
              <DotPill>Grupo VIP Oficial · +400 acompanhando</DotPill>
              <h1 className="funnel-vip__title" id="vip-title">
                Acesso direto ao <em>Grupo VIP</em> da Pharmil
              </h1>
              <p className="funnel-vip__lede">
                Entre em um clique no canal oficial do WhatsApp para acompanhar chegadas
                de lote, condições exclusivas de cliente e orientação da equipe.
              </p>

              <ul className="funnel-vip__list">
                {VIP_HIGHLIGHTS.map((item) => (
                  <li className="funnel-vip__list-item" key={item.title}>
                    <IconBox>
                      <span
                        className={`funnel-trust__icon funnel-trust__icon--${item.tone}`}
                      >
                        {item.icon}
                      </span>
                    </IconBox>
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.detail}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="funnel-vip__cta">
                <Button
                  block
                  href={vipGroupUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <ChatBubbleIcon size={18} strokeWidth={2.5} />
                  Entrar no Grupo VIP no WhatsApp
                </Button>

                <p className="funnel-secondary-link">
                  Prefere atendimento individual?{" "}
                  <a
                    href={directWhatsappUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Atendimento direto no WhatsApp (48) 99115-3151
                  </a>
                </p>

                <p className="funnel-lgpd">
                  <ShieldIcon size={15} strokeWidth={2.2} />
                  <span>Entrada gratuita · Saia quando quiser · Canal oficial Pharmil</span>
                </p>
              </div>
            </div>

            <div className="showcase funnel-vip__stage">
              <div aria-hidden="true" className="showcase__halo" />
              <span aria-hidden="true" className="showcase__dot showcase__dot--a" />
              <span aria-hidden="true" className="showcase__dot showcase__dot--b" />
              <div className="showcase__stage" data-sway>
                <Image
                  alt=""
                  aria-hidden="true"
                  className="showcase__ground"
                  data-ground
                  height={642}
                  src="/images/hero-podium.png"
                  width={1632}
                />
                <Image
                  alt="Linha Pharmil sobre pódio: T.G. 15, Lipoless 15, GHKCU 100 mg, Klow 80 mg e GHK-Cu 50 mg"
                  className="showcase__object"
                  data-float
                  height={642}
                  priority
                  sizes="(max-width: 992px) 92vw, 540px"
                  src="/images/hero-podium.png"
                  width={1632}
                />
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="vip-proof-title" className="lp-proof">
          <div className="lp-proof__inner">
            <div>
              <Eyebrow tone="orange">Operação verificada</Eyebrow>
              <h2 className="section-title lp-proof__title" id="vip-proof-title">
                Procedência e cadeia fria em cada envio.
              </h2>
              <p className="lp-proof__lede">
                Conferência de lote, embalagem térmica monitorada e código de rastreio
                atualizado direto no WhatsApp.
              </p>
            </div>
            <ul className="lp-stats">
              <li>
                <Stat
                  detail="faixa mantida do estoque até a entrega"
                  onDark
                  value="2–8 °C"
                />
              </li>
              <li>
                <Stat
                  detail="autonomia térmica da embalagem lacrada"
                  onDark
                  value="48h"
                />
              </li>
              <li>
                <Stat
                  detail="dos envios com lacre numerado e rastreio"
                  onDark
                  value="100%"
                />
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
