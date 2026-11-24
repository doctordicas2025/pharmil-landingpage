import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Button, Card, CardBody, DotPill } from "@/design-system";
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

export default function VipPage() {
  const vipGroupUrl = resolveVipGroupInviteUrl(
    process.env.NEXT_PUBLIC_WHATSAPP_VIP_GROUP_URL,
  );
  const directWhatsappUrl = buildDirectWhatsAppUrl(
    process.env.NEXT_PUBLIC_WHATSAPP_OFFICIAL_NUMBER,
  );

  return (
    <div className="funnel-page">
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
        <Card>
          <CardBody>
            <div className="funnel-card__body">
              <DotPill>Acesso imediato no WhatsApp</DotPill>
              <h1 className="funnel-card__title">
                Entre no Grupo VIP oficial da Pharmil
              </h1>
              <p className="funnel-card__subtitle">
                Receba avisos de chegada de lote, condições de cliente e acompanhamento
                direto da equipe em um clique.
              </p>

              <div className="funnel-actions funnel-actions--stack">
                <Button
                  block
                  href={vipGroupUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
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
                Entrada gratuita · Saia quando quiser · Canal oficial Pharmil
              </p>
            </div>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
