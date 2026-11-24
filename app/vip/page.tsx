import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  ChatBubbleIcon,
  CheckIcon,
  ShieldIcon,
} from "@/components/funnel/FunnelIcons";
import { Button, Card, CardBody, DotPill } from "@/design-system";
import {
  buildDirectWhatsAppUrl,
  resolveVipGroupInviteUrl,
} from "@/lib/funnel/quiz-config";

export const metadata: Metadata = {
  title: { absolute: "Pharmil · Grupo VIP Oficial" },
  description:
    "Acesso direto ao Grupo VIP oficial da Pharmil no WhatsApp com avisos, atualizações e acompanhamento da equipe.",
  robots: { index: false, follow: false },
};

const VIP_HIGHLIGHTS = [
  "Acesso direto às atualizações e condições da semana no canal oficial.",
  "Orientações claras e avisos publicados em primeira mão pela equipe.",
  "Entrada gratuita no WhatsApp, com liberdade para sair quando quiser.",
] as const;

export default function VipPage() {
  const vipGroupUrl = resolveVipGroupInviteUrl(
    process.env.NEXT_PUBLIC_WHATSAPP_VIP_GROUP_URL,
  );
  const directWhatsappUrl = buildDirectWhatsAppUrl(
    process.env.NEXT_PUBLIC_WHATSAPP_OFFICIAL_NUMBER,
  );

  return (
    <div className="funnel-page">
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

      <main className="funnel-main" id="conteudo">
        <div className="funnel-intro">
          <DotPill>Canal Oficial Pharmil · Acesso em 1 clique</DotPill>
        </div>

        <Card>
          <CardBody>
            <div className="funnel-card__body funnel-step-enter">
              <h1 className="funnel-card__title funnel-card__title--tight">
                Entre no Grupo VIP oficial da Pharmil
              </h1>
              <p className="funnel-card__subtitle">
                Toque no botão abaixo para abrir o WhatsApp diretamente no nosso Grupo
                VIP oficial e acompanhar todas as atualizações com a equipe.
              </p>

              <ul className="funnel-vip-card__list">
                {VIP_HIGHLIGHTS.map((item) => (
                  <li className="funnel-vip-card__item" key={item}>
                    <span aria-hidden="true" className="funnel-analyzing__check">
                      <CheckIcon size={14} strokeWidth={2.75} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="funnel-actions funnel-actions--stack">
                <Button
                  block
                  href={vipGroupUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <ChatBubbleIcon size={18} strokeWidth={2.5} />
                  Entrar no Grupo VIP no WhatsApp
                </Button>
              </div>

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
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
