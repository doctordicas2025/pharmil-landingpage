import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Footer from "@/components/sections/Footer";
import {
  Accordion,
  Button,
  Card,
  CardBody,
  DotPill,
  TextLink,
} from "@/design-system";
import { getContactHref, getWhatsappHref } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Confira sua caixa",
  description:
    "Aponte a câmera para o QR code da caixa e quem responde é o laboratório fabricante e a DINAVISA.",
  robots: { index: false, follow: false },
};

const VALIQ_URL = "https://valiq.app";

const steps = [
  {
    title: "Aponte a câmera para o QR",
    detail: "Qualquer celular lê, sem baixar aplicativo.",
  },
  {
    title: "O laboratório responde",
    detail: "O Valiq consulta quem fabricou o produto e diz se a caixa é original.",
  },
  {
    title: "A DINAVISA confirma o registro",
    detail: "O registro sanitário aparece junto, direto do órgão regulador do Paraguai.",
  },
] as const;

const checks = [
  { title: "Laudo do lote", detail: "Peça antes de fechar o pedido." },
  { title: "Temperatura", detail: "Caixa térmica entre 2 e 8 °C, com registro no envio." },
  { title: "Rastreio", detail: "Código no mesmo dia do envio." },
  { title: "Dispensação", detail: "Farmácia parceira regularizada, mediante prescrição." },
] as const;

const faq = [
  {
    question: "E se o QR não ler?",
    answer: "Mande a foto da caixa no WhatsApp e a equipe confere o lote com você.",
  },
  {
    question: "Preciso de receita médica?",
    answer:
      "Sim, sempre que o item exigir. A dispensação é feita por farmácia parceira habilitada, mediante receita válida e acompanhamento de profissional de saúde.",
  },
  {
    question: "Como sei que o pedido vai chegar?",
    answer:
      "Você recebe o código de rastreio no mesmo dia do envio, com foto do lacre da caixa térmica.",
  },
  {
    question: "E se a caixa chegar violada?",
    answer:
      "Não use o produto. Fale com a equipe pelo WhatsApp; o caso segue o que está nos Termos de Uso.",
  },
] as const;

export default function OriginalPage() {
  // Mensagem propria para a equipe saber que o lead veio desta pagina.
  const orderHref = getWhatsappHref(
    "Olá, vim pela página de verificação da Pharmil e quero conferir a disponibilidade.",
  );

  return (
    <>
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
        <span className="lp-header__note">Conferência pelo Valiq</span>
      </header>

      <main id="conteudo">
        <section aria-labelledby="original-title" className="lp-hero">
          <div aria-hidden="true" className="hero__halo" />

          <div className="lp-hero__inner">
            <div className="lp-hero__copy">
              <DotPill>Verificação na fonte</DotPill>

              <h1 className="lp-hero__title og-title" id="original-title">
                Não precisa confiar na gente.
                <span>Confira com quem fabricou.</span>
              </h1>

              <p className="lp-hero__lede">
                Aponte a câmera para o QR code da caixa e quem responde é o
                laboratório fabricante e a DINAVISA.
              </p>

              <div className="og-actions">
                <Button href={orderHref} rel="noopener noreferrer" target="_blank">
                  Falar no WhatsApp
                </Button>
                <TextLink href="#como-conferir">Ver como conferir</TextLink>
              </div>
            </div>

            <div className="lp-stage">
              <div aria-hidden="true" className="lp-stage__halo" />
              <span aria-hidden="true" className="lp-stage__dot lp-stage__dot--a" />
              <span aria-hidden="true" className="lp-stage__dot lp-stage__dot--b" />

              <div className="lp-stage__frame og-stage" data-sway>
                <span aria-hidden="true" className="lp-stage__ground" data-ground />
                {/* O visor de camera mostra o gesto de escanear. Nao ha tela de
                    resultado simulada: a da cliente pode ser diferente. */}
                <div className="og-scan" data-float>
                  <Image
                    alt="Caixa do T.G. 15 dentro de um visor de câmera, pronta para ser escaneada"
                    className="og-scan__art"
                    height={1254}
                    priority
                    sizes="(max-width: 992px) 72vw, 380px"
                    src="/images/cut-tg.png"
                    width={1254}
                  />
                  <span aria-hidden="true" className="og-scan__corner og-scan__corner--tl" />
                  <span aria-hidden="true" className="og-scan__corner og-scan__corner--tr" />
                  <span aria-hidden="true" className="og-scan__corner og-scan__corner--bl" />
                  <span aria-hidden="true" className="og-scan__corner og-scan__corner--br" />
                  <span aria-hidden="true" className="og-scan__line" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="medo-title" className="lp-section og-fear">
          <h2 className="section-title" id="medo-title">
            Desconfiar é o certo.
          </h2>
          <p className="og-fear__text">
            Tem muita ampola falsa circulando, e injetar algo sem saber a origem
            não é detalhe. Por isso a conferência fica com você.
          </p>
        </section>

        <section aria-labelledby="passos-title" className="lp-section" id="como-conferir">
          <h2 className="section-title" id="passos-title">
            Três passos, com a caixa na mão.
          </h2>

          <ol className="lp-grid lp-grid--3 lp-steps">
            {steps.map((step, index) => (
              <Card as="li" key={step.title}>
                <CardBody>
                  <span aria-hidden="true" className="lp-step__number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="lp-card__title">{step.title}</h3>
                  <p className="lp-card__text">{step.detail}</p>
                </CardBody>
              </Card>
            ))}
          </ol>

          <div className="og-valiq">
            <TextLink external href={VALIQ_URL}>
              Abrir o Valiq
            </TextLink>
          </div>
        </section>

        <section aria-label="Verificações feitas" className="lp-proof og-count">
          <div className="og-count__inner">
            <p className="og-count__number">+89 mil</p>
            <p className="og-count__label">verificações feitas no Valiq até agora</p>
          </div>
        </section>

        <section aria-labelledby="checks-title" className="lp-section">
          <h2 className="section-title" id="checks-title">
            O que mais dá pra conferir.
          </h2>

          <ul className="og-checks">
            {checks.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.detail}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="faq-original-title" className="lp-section">
          <div className="lp-faq">
            <div>
              <h2 className="section-title" id="faq-original-title">
                Antes de comprar.
              </h2>
              <p className="lp-card__text lp-faq__lede">
                Se a sua dúvida não estiver aqui, a equipe responde no WhatsApp.
              </p>
            </div>
            <Accordion items={faq} />
          </div>
        </section>

        <section aria-labelledby="cta-original-title" className="lp-final">
          <div className="lp-final__inner">
            <h2 className="lp-final__title" id="cta-original-title">
              Confira antes de confiar.
            </h2>
            <p className="lp-final__lede">
              Peça o laudo antes de pagar e confira o QR quando a caixa chegar.
            </p>
            <Button
              className="lp-final__button"
              href={orderHref}
              rel="noopener noreferrer"
              target="_blank"
            >
              Falar no WhatsApp
            </Button>
            <p className="lp-final__note">
              Uso sob orientação profissional. A dispensação é feita por farmácia
              parceira habilitada, mediante prescrição.
            </p>
          </div>
        </section>
      </main>

      <Footer contactHref={getContactHref()} />
    </>
  );
}
