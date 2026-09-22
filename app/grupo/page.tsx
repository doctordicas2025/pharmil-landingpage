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
  Eyebrow,
  IconBox,
  Stat,
} from "@/design-system";
import { getContactHref, getGroupHref, hasGroupLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Grupo de clientes",
  description:
    "Sorteios e promoções da Pharmil toda semana no grupo, com lote, validade e laudo à vista.",
  robots: { index: false, follow: false },
};

const benefits = [
  {
    title: "Condição de cliente",
    detail:
      "O preço praticado no grupo é o de cliente recorrente, não o de primeira compra. Quem está dentro vê antes de qualquer anúncio.",
    icon: (
      <svg fill="none" height="18" stroke="var(--color-wine)" strokeWidth="1.7" viewBox="0 0 24 24" width="18">
        <path d="M3 9.5 12 4l9 5.5v9L12 24l-9-5.5z" />
        <path d="M12 12v8" />
      </svg>
    ),
  },
  {
    title: "Aviso de chegada de lote",
    detail:
      "Lote novo é avisado ali primeiro, com quantidade e validade. É como quem tem pressa não fica esperando resposta.",
    icon: (
      <svg fill="none" height="18" stroke="var(--color-orange)" strokeWidth="1.7" viewBox="0 0 24 24" width="18">
        <path d="M4 7h11v10H4z" />
        <path d="M15 10h4l2 3v4h-6" />
        <circle cx="7.5" cy="18" r="1.8" />
        <circle cx="17" cy="18" r="1.8" />
      </svg>
    ),
  },
  {
    title: "Laudo por lote, publicado",
    detail:
      "Cada lote entra com o laudo de análise junto. Você confere a pureza antes de decidir, não depois de receber.",
    icon: (
      <svg fill="none" height="18" stroke="var(--color-navy)" strokeWidth="1.7" viewBox="0 0 24 24" width="18">
        <path d="M7 3h7l4 4v14H7z" />
        <path d="M10 12h5M10 16h5" />
      </svg>
    ),
  },
  {
    title: "Linha direta com a equipe",
    detail:
      "Dúvida de conservação, prazo ou apresentação é respondida por quem acompanha o pedido. Sem robô e sem fila.",
    icon: (
      <svg fill="none" height="18" stroke="var(--color-wine)" strokeWidth="1.7" viewBox="0 0 24 24" width="18">
        <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.7-5.2A8.5 8.5 0 1 1 21 11.5Z" />
      </svg>
    ),
  },
] as const;

const steps = [
  {
    title: "Você entra",
    detail: "Um toque no botão abre o WhatsApp já no grupo. Sem cadastro e sem formulário.",
  },
  {
    title: "A equipe se apresenta",
    detail: "Você recebe as regras do canal e diz o que procura. Ninguém é abordado no privado sem pedir.",
  },
  {
    title: "Você acompanha",
    detail: "Chegada de lote, laudo e condição de cliente chegam no grupo. Você responde quando fizer sentido.",
  },
] as const;

const faq = [
  {
    question: "Preciso comprar para entrar?",
    answer:
      "Não. O grupo é aberto a quem está avaliando e a quem já é cliente. Entrar não gera compromisso nem cobrança.",
  },
  {
    question: "Vou receber mensagem no privado?",
    answer:
      "Só se você pedir. O canal é de avisos e dúvidas no grupo; abordagem no privado sem solicitação não é como trabalhamos.",
  },
  {
    question: "Preciso de receita médica?",
    answer:
      "Sim, sempre que o item exigir. A dispensação é feita por farmácia parceira habilitada, mediante receita válida e acompanhamento de profissional de saúde. A equipe informa os requisitos antes de qualquer pedido.",
  },
  {
    question: "Como sei que o produto é procedente?",
    answer:
      "Cada lote tem laudo de análise, publicado no grupo quando entra. Você também pode pedir a foto da embalagem e a validade do lote antes de fechar.",
  },
  {
    question: "Dá para sair depois?",
    answer:
      "A qualquer momento, pelo próprio WhatsApp, sem precisar avisar ninguém.",
  },
] as const;

export default function GrupoPage() {
  const groupHref = getGroupHref();
  const contactHref = getContactHref();
  const linkPronto = hasGroupLink();

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
              src="/brand/pharmil-logo.jpg"
              width={1254}
            />
          </span>
        </Link>
        <span className="lp-header__note">Canal oficial de clientes</span>
      </header>

      <main id="conteudo">
        <section aria-labelledby="grupo-title" className="lp-hero">
          <div aria-hidden="true" className="hero__halo" />

          <div className="lp-hero__inner">
            <div className="lp-hero__copy">
              <DotPill>Toda semana no grupo</DotPill>

              <h1 className="lp-hero__title" id="grupo-title">
                Grupo de sorteios
                <br />
                e promoções da Pharmil
              </h1>

              <p className="lp-hero__lede">
                Segunda, quarta e sexta tem sorteio e condição da semana para quem
                está no grupo — com lote, validade e laudo à vista.
              </p>

              <ul className="lp-hero__days">
                <li>
                  <strong>SEG</strong>
                  <span>Sorteio aberto a todos</span>
                </li>
                <li>
                  <strong>QUA</strong>
                  <span>Sorteio de clientes</span>
                </li>
                <li>
                  <strong>SEX</strong>
                  <span>Sorteio de clientes</span>
                </li>
              </ul>

              <div className="lp-hero__cta">
                <Button
                  href={groupHref}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Entrar no grupo
                  <span aria-hidden="true">→</span>
                </Button>
                <p className="lp-hero__meta">
                  <strong>400 pessoas</strong> já acompanham · entrada gratuita ·
                  saia quando quiser
                </p>
              </div>

              {linkPronto ? null : (
                <p className="lp-hero__pending" role="status">
                  Convite sendo liberado. Enquanto isso, o botão leva ao
                  atendimento e a equipe adiciona você.
                </p>
              )}
            </div>

            <div className="lp-stage">
              <div aria-hidden="true" className="lp-stage__halo" />
              <span aria-hidden="true" className="lp-stage__dot lp-stage__dot--a" />
              <span aria-hidden="true" className="lp-stage__dot lp-stage__dot--b" />

              <div className="lp-stage__frame" data-sway>
                <span aria-hidden="true" className="lp-stage__ground" data-ground />
                <Image
                  alt="Sorteio gratuito: participe da comunidade Pharmil"
                  className="lp-stage__art"
                  data-float
                  height={1254}
                  priority
                  sizes="(max-width: 992px) 78vw, 420px"
                  src="/images/grupo-sorteio.png"
                  width={1254}
                />
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="beneficios-title" className="lp-section">
          <Eyebrow>O que acontece lá dentro</Eyebrow>
          <h2 className="section-title" id="beneficios-title">
            Quatro motivos para estar no grupo.
          </h2>

          <ul className="lp-grid lp-grid--4">
            {benefits.map((item) => (
              <Card as="li" key={item.title}>
                <CardBody>
                  <IconBox>{item.icon}</IconBox>
                  <h3 className="lp-card__title">{item.title}</h3>
                  <p className="lp-card__text">{item.detail}</p>
                </CardBody>
              </Card>
            ))}
          </ul>
        </section>

        <section aria-labelledby="processo-title" className="lp-proof">
          <div className="lp-proof__inner">
            <div>
              <Eyebrow tone="orange">Antes de você entrar</Eyebrow>
              <h2 className="section-title lp-proof__title" id="processo-title">
                O cuidado não começa no grupo.
              </h2>
              <p className="lp-proof__lede">
                O grupo é o canal. O que sustenta ele é o processo: conferência
                dupla de lote e temperatura, caixa térmica lacrada e rastreio no
                mesmo dia do envio.
              </p>
            </div>

            <ul className="lp-stats">
              <li>
                <Stat detail="faixa mantida do estoque à entrega, com registro no envio" onDark value="2–8 °C" />
              </li>
              <li>
                <Stat detail="autonomia térmica da embalagem em rotas mais longas" onDark value="48h" />
              </li>
              <li>
                <Stat detail="dos pedidos com lacre numerado e código de rastreio" onDark value="100%" />
              </li>
            </ul>
          </div>
        </section>

        <section aria-labelledby="passos-title" className="lp-section">
          <Eyebrow>Como funciona</Eyebrow>
          <h2 className="section-title" id="passos-title">
            Três passos, um toque.
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
        </section>

        <section aria-labelledby="faq-grupo-title" className="lp-section">
          <div className="lp-faq">
            <div>
              <Eyebrow>Dúvidas</Eyebrow>
              <h2 className="section-title" id="faq-grupo-title">
                Antes de entrar.
              </h2>
              <p className="lp-card__text lp-faq__lede">
                Se a sua pergunta não estiver aqui, a equipe responde no
                atendimento.
              </p>
            </div>
            <Accordion items={faq} />
          </div>
        </section>

        <section aria-labelledby="cta-grupo-title" className="lp-final">
          <div className="lp-final__inner">
            <h2 className="lp-final__title" id="cta-grupo-title">
              Entre agora e acompanhe o próximo lote.
            </h2>
            <p className="lp-final__lede">
              Entrada gratuita, sem cadastro. Você sai quando quiser.
            </p>
            <Button
              className="lp-final__button"
              href={groupHref}
              rel="noopener noreferrer"
              target="_blank"
            >
              Entrar no grupo
              <span aria-hidden="true">→</span>
            </Button>
            <p className="lp-final__note">
              Uso sob orientação profissional. A dispensação é feita por farmácia
              parceira habilitada, mediante prescrição.
            </p>
          </div>
        </section>
      </main>

      <Footer contactHref={contactHref} />
    </>
  );
}
