import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  ChatBubbleIcon,
  CheckIcon,
  ShieldIcon,
} from "@/components/funnel/FunnelIcons";
import { Button, Card, CardBody, DotPill, Eyebrow, IconBox, Notice } from "@/design-system";
import { resolveOfficialWhatsAppNumber } from "@/lib/funnel/quiz-config";
import { companyInfo } from "@/lib/site-config";

export const INSTITUTIONAL_METADATA: Metadata = {
  title: { absolute: "Pharmil · Saúde, Rotina e Hábitos Saudáveis" },
  description:
    "Portal institucional dedicado à organização de rotina, hábitos saudáveis, bem-estar e informações claras com responsabilidade.",
  openGraph: {
    title: "Pharmil · Saúde, Rotina e Hábitos Saudáveis",
    description:
      "Organização de rotina, hábitos saudáveis e informações claras com responsabilidade.",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Pharmil · Saúde, Rotina e Hábitos Saudáveis",
    description:
      "Organização de rotina, hábitos saudáveis e informações claras com responsabilidade.",
  },
};

const EDITORIAL_PRINCIPLES = [
  {
    index: "01",
    title: "Constância diária",
    detail:
      "Pequenos hábitos estruturados em horários previsíveis sustentam a rotina ao longo do tempo.",
  },
  {
    index: "02",
    title: "Informação transparente",
    detail:
      "Orientações claras e acessíveis para apoiar decisões conscientes junto a profissionais de saúde.",
  },
  {
    index: "03",
    title: "Cuidado com privacidade",
    detail:
      "Atendimento informativo pautado por respeito aos dados pessoais e boas práticas da LGPD.",
  },
] as const;

const PILLARS = [
  {
    title: "Organização de rotina",
    description:
      "Conteúdos práticos sobre planejamento de horários, hidratação, descanso e equilíbrio na agenda diária.",
    icon: <CheckIcon size={18} strokeWidth={2.5} />,
    tone: "wine",
  },
  {
    title: "Hábitos sustentáveis",
    description:
      "Abordagem educativa voltada ao bem-estar contínuo, sem promessas irreais e sempre incentivando acompanhamento profissional.",
    icon: <ShieldIcon size={18} strokeWidth={2.2} />,
    tone: "navy",
  },
  {
    title: "Atendimento humano",
    description:
      "Equipe disponível em canal oficial para esclarecimentos institucionais e suporte ao visitante com clareza.",
    icon: <ChatBubbleIcon size={18} strokeWidth={2.3} />,
    tone: "orange",
  },
] as const;

export function getInstitutionalContactHref(): string {
  const whatsappNumber = resolveOfficialWhatsAppNumber(
    process.env.NEXT_PUBLIC_WHATSAPP_OFFICIAL_NUMBER,
  );
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Olá. Gostaria de receber informações institucionais sobre bem-estar e organização de rotina.",
  )}`;
}

export function InstitutionalHeader({ contactHref }: { contactHref: string }) {
  return (
    <header className="lp-header">
      <Link aria-label="Pharmil Institucional" className="lp-header__brand" href="/">
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
        href={contactHref}
        rel="noopener noreferrer"
        size="sm"
        target="_blank"
      >
        <ChatBubbleIcon size={16} strokeWidth={2.4} />
        Falar com a equipe
      </Button>
    </header>
  );
}

export function InstitutionalFooter() {
  return (
    <footer className="funnel-inst-footer">
      <div className="funnel-inst-footer__inner">
        <div className="funnel-inst-footer__brand">
          <span className="funnel-inst-footer__name">{companyInfo.tradeName}</span>
          <p>Portal institucional de saúde, organização de rotina e hábitos saudáveis.</p>
        </div>

        <div>
          <p className="site-footer__heading">Contato</p>
          <ul className="site-footer__list">
            <li>{companyInfo.email}</li>
            <li className="site-footer__address">
              SAUS Q. 5, Bloco N, Sala 307
              <br />
              Asa Sul, Brasília/DF
            </li>
          </ul>
        </div>

        <div>
          <p className="site-footer__heading">Institucional</p>
          <ul className="site-footer__list">
            <li>
              <Link href="/termos">Termos de uso</Link>
            </li>
            <li>
              <Link href="/privacidade">Política de privacidade</Link>
            </li>
            <li className="site-footer__address">CNPJ {companyInfo.cnpj}</li>
          </ul>
        </div>
      </div>

      <div className="funnel-inst-footer__bottom">
        <div className="funnel-inst-footer__bottom-inner">
          <p>
            {companyInfo.tradeName}&reg; · Operado por {companyInfo.legalName} — CNPJ{" "}
            {companyInfo.cnpj}
          </p>
          <p>© {new Date().getFullYear()} {companyInfo.tradeName}</p>
        </div>
      </div>
    </footer>
  );
}

export function InstitutionalPortal() {
  const contactHref = getInstitutionalContactHref();

  return (
    <div className="funnel-institucional">
      <InstitutionalHeader contactHref={contactHref} />

      <main id="conteudo">
        <section className="funnel-institucional__band">
          <div aria-hidden="true" className="funnel-page__halo" />
          <div className="funnel-institucional__main">
            <div className="funnel-institucional__grid">
              <div className="funnel-institucional__hero">
                <DotPill>Portal Institucional · Saúde e Rotina</DotPill>
                <h1 className="funnel-institucional__title">
                  Organização de rotina e hábitos saudáveis com clareza no dia a dia
                </h1>
                <p className="funnel-institucional__lede">
                  Nosso espaço institucional reúne princípios simples de planejamento
                  diário, bem-estar e informação responsável para apoiar escolhas
                  saudáveis com equilíbrio.
                </p>
                <div className="funnel-institucional__cta">
                  <Button
                    href={contactHref}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <ChatBubbleIcon size={18} strokeWidth={2.5} />
                    Falar com nossa equipe
                  </Button>
                </div>
              </div>

              <aside
                aria-label="Pilares editoriais de rotina"
                className="funnel-editorial-card"
              >
                <Eyebrow tone="wine">Guia editorial</Eyebrow>
                <h2 className="funnel-editorial-card__title">
                  Três fundamentos de uma rotina equilibrada
                </h2>
                <ol className="funnel-editorial-card__list">
                  {EDITORIAL_PRINCIPLES.map((item) => (
                    <li className="funnel-editorial-item" key={item.index}>
                      <span aria-hidden="true" className="funnel-editorial-item__index">
                        {item.index}
                      </span>
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </aside>
            </div>

            <section
              aria-label="Frentes institucionais"
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

        <section aria-labelledby="inst-manifesto-title" className="lp-proof">
          <div className="lp-proof__inner">
            <div>
              <Eyebrow tone="orange">Compromisso editorial</Eyebrow>
              <h2 className="section-title lp-proof__title" id="inst-manifesto-title">
                Bem-estar construído com rotina, constância e responsabilidade.
              </h2>
              <p className="lp-proof__lede">
                Acreditamos em comunicação objetiva, respeito à individualidade de cada
                pessoa e valorização do acompanhamento profissional em saúde.
              </p>
            </div>
            <ul className="funnel-manifesto-list">
              <li>
                <strong>Rotina</strong>
                <span>
                  Hábitos de sono, alimentação equilibrada e movimento adaptados à sua
                  realidade.
                </span>
              </li>
              <li>
                <strong>Clareza</strong>
                <span>
                  Informações diretas, em linguagem acessível e sem promessas exageradas.
                </span>
              </li>
              <li>
                <strong>Privacidade</strong>
                <span>
                  Respeito integral aos dados pessoais informados em qualquer contato.
                </span>
              </li>
            </ul>
          </div>
        </section>

        <div className="funnel-institucional__main">
          <Notice title="Aviso informativo e proteção de dados (LGPD)" tone="info">
            Este portal tem caráter exclusivamente informativo e institucional. As
            orientações sobre hábitos saudáveis não substituem avaliação ou
            acompanhamento por profissional de saúde habilitado.
          </Notice>
        </div>
      </main>

      <InstitutionalFooter />
    </div>
  );
}
