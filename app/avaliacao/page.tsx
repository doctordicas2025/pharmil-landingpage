import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";

import { QuizAvaliacaoClient } from "@/components/funnel/QuizAvaliacaoClient";
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
        <span className="lp-header__note">Diagnóstico rápido · 1 min</span>
      </header>

      <main className="funnel-main" id="conteudo">
        <QuizAvaliacaoClient attribution={attribution} />
      </main>
    </div>
  );
}
