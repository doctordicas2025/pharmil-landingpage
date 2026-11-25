import type { Metadata } from "next";

import { Calculator } from "@/components/calculator/Calculator";
import { Header } from "@/components/Header";
import Footer from "@/components/sections/Footer";
import { Accordion, Button, TextLink } from "@/design-system";
import { getContactHref, getSiteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Calculadora de conversão em unidades",
  description:
    "Converta miligramas para unidades na escala U-100 conforme a concentração do rótulo: TG 15, Lipoless MD 15 ou outra apresentação. Conta aberta, sem cadastro.",
  alternates: { canonical: "/calculadora" },
  robots: { index: false, follow: false, nocache: true },
};

const VALIQ_URL = "https://valiq.app";

const faq = [
  {
    question: "Por que a mesma quantidade em mg dá unidades diferentes no TG 15 e no Lipoless MD 15?",
    answer:
      "Porque a concentração muda. No TG 15 — Linha MOMO, cada 15 mg vêm em 0,5 mL; no Lipoless MD 15 — Linha MOMO, em 0,6 mL. A escala em unidades mede volume: 5 mg equivalem a 16,7 unidades no TG 15 e 20 unidades no Lipoless MD 15. Trocou de apresentação, refaça a conta.",
  },
  {
    question: "Minha apresentação não está na lista. E agora?",
    answer:
      "Escolha \"Outro produto\" e digite os mg e os mL impressos no rótulo. A matemática é a mesma para qualquer apresentação: depende apenas da concentração.",
  },
  {
    question: "Serve para qualquer escala?",
    answer:
      "A conversão vale exclusivamente para a escala U-100, na qual 100 unidades equivalem a 1 mL. Escalas graduadas apenas em mL não utilizam essa conversão.",
  },
  {
    question: "O resultado caiu entre duas marcações. Como proceder?",
    answer:
      "Na escala de 1 mL as marcações avançam de 2 em 2 unidades, então 16,7 fica entre 16 e 18. Confirme sempre o arredondamento com o profissional que acompanha seu protocolo. Escalas de 0,3 e 0,5 mL marcam de 1 em 1 unidade.",
  },
  {
    question: "Posso dividir várias doses da mesma unidade?",
    answer:
      "O Lipoless MD 15 é multidose (4 doses de 15 mg na mesma unidade). Nas demais apresentações, siga sempre o rótulo do fabricante quanto ao uso único ou multidose e conservação entre 2°C e 8°C.",
  },
  {
    question: "A calculadora substitui acompanhamento profissional?",
    answer:
      "Não. Ela realiza apenas a conversão matemática de mg para unidades U-100. Definição de protocolo, escalonamento e intervalos são responsabilidade exclusiva do profissional que acompanha você.",
  },
] as const;

export default function CalculadoraPage() {
  const contactHref = getContactHref();
  const shareUrl = new URL("/calculadora", getSiteUrl()).toString();

  return (
    <>
      <Header contactHref={contactHref} />
      <main className="calc-page">
        <header className="calc-hero page-shell">
          <h1 className="calc-hero__title">Conversor de miligramas para unidades</h1>
          <p className="calc-hero__lede">
            Escolha a apresentação, a escala e a quantidade definida em miligramas. A
            conta converte mg em unidades na escala U-100 com total transparência.
          </p>
        </header>

        <div className="page-shell">
          <Calculator shareUrl={shareUrl} />
        </div>

        <section aria-labelledby="valiq-titulo" className="calc-valiq">
          <div className="calc-valiq__inner page-shell">
            <div>
              <h2 className="calc-valiq__title" id="valiq-titulo">
                Conferência de lote e autenticidade na palma da mão.
              </h2>
              <p className="calc-valiq__text">
                Toda caixa enviada pela Pharmil traz QR code de conferência. Aponte a
                câmera e valide no Valiq antes de iniciar seu protocolo.
              </p>
            </div>
            <div className="calc-valiq__actions">
              <Button href={VALIQ_URL} rel="noopener noreferrer" target="_blank">
                Verificar no Valiq
              </Button>
              <TextLink href="/original">Como funciona a verificação</TextLink>
            </div>
          </div>
        </section>

        <section aria-labelledby="duvidas-titulo" className="calc-faq page-shell">
          <h2 className="calc-faq__title" id="duvidas-titulo">
            Dúvidas sobre a conta
          </h2>
          <Accordion items={faq} />
        </section>

        <aside aria-label="Aviso" className="calc-disclaimer page-shell">
          <p>
            Esta calculadora faz uma conversão matemática de miligramas para unidades na
            escala U-100 a partir dos dados informados. Ela não substitui orientação
            profissional individualizada. Confira sempre o rótulo da embalagem antes de
            utilizar.
          </p>
        </aside>
      </main>
      <Footer contactHref={contactHref} />
    </>
  );
}
