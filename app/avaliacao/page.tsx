import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";

import {
  ColdChainIcon,
  PackageTrackIcon,
  ShieldIcon,
} from "@/components/funnel/FunnelIcons";
import { QuizAvaliacaoClient } from "@/components/funnel/QuizAvaliacaoClient";
import { DotPill, IconBox } from "@/design-system";
import {
  ATTRIBUTION_COOKIE_NAME,
  extractAttribution,
} from "@/lib/funnel/traffic-routing";

export const metadata: Metadata = {
  title: { absolute: "Pharmil · Avaliação Rápida de Rotina" },
  description:
    "Responda 4 perguntas rápidas para liberar o acesso ao Grupo VIP oficial da Pharmil no WhatsApp.",
  robots: { index: false, follow: false },
};

type SearchParamsRecord = Record<string, string | string[] | undefined>;

function toUrlSearchParams(record: SearchParamsRecord): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(record)) {
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value) && typeof value[0] === "string") {
      params.set(key, value[0]);
    }
  }
  return params;
}

const TRUST_SIGNALS = [
  {
    title: "Cadeia fria 2–8 °C",
    detail: "Caixa térmica lacrada do estoque até a entrega.",
    icon: <ColdChainIcon size={18} strokeWidth={2.2} />,
    tone: "navy",
  },
  {
    title: "Laudo por lote",
    detail: "Pureza e validade informadas antes da confirmação.",
    icon: <ShieldIcon size={18} strokeWidth={2.2} />,
    tone: "wine",
  },
  {
    title: "100% rastreado",
    detail: "Lacre numerado e código enviado direto no WhatsApp.",
    icon: <PackageTrackIcon size={18} strokeWidth={2.2} />,
    tone: "orange",
  },
] as const;

export default async function AvaliacaoPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsRecord>;
}) {
  const [resolvedParams, cookieStore] = await Promise.all([
    searchParams,
    cookies(),
  ]);
  const attribution = extractAttribution(
    toUrlSearchParams(resolvedParams),
    cookieStore.get(ATTRIBUTION_COOKIE_NAME)?.value,
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
        <span className="lp-header__note">Avaliação rápida · 1 min</span>
      </header>

      <main className="funnel-main" id="conteudo">
        <div className="funnel-intro">
          <DotPill>Canal Oficial Pharmil · Avaliação gratuita</DotPill>
          <p className="funnel-intro__caption">
            4 perguntas rápidas para direcionar seu atendimento e liberar o acesso ao
            Grupo VIP oficial.
          </p>
        </div>

        <QuizAvaliacaoClient attribution={attribution} />

        <section aria-label="Garantias operacionais Pharmil" className="funnel-trust">
          {TRUST_SIGNALS.map((signal) => (
            <div className="funnel-trust__item" key={signal.title}>
              <IconBox>
                <span className={`funnel-trust__icon funnel-trust__icon--${signal.tone}`}>
                  {signal.icon}
                </span>
              </IconBox>
              <div>
                <p className="funnel-trust__title">{signal.title}</p>
                <p className="funnel-trust__detail">{signal.detail}</p>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
