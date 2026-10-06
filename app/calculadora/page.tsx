import type { Metadata } from "next";

import { Calculator } from "@/components/calculator/Calculator";
import { Header } from "@/components/Header";
import Footer from "@/components/sections/Footer";
import { Accordion, Button, TextLink } from "@/design-system";
import { getContactHref, getSiteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Calculadora de dose em unidades",
  description:
    "Converta a dose prescrita em mg para unidades da seringa de insulina U-100, conforme a concentração do seu frasco. Conta aberta, sem cadastro.",
  alternates: { canonical: "/calculadora" },
};

const VALIQ_URL = "https://valiq.app";

const faq = [
  {
    question: "Por que a mesma dose dá unidades diferentes em cada marca?",
    answer:
      "Porque cada frasco tem uma concentração. A unidade da seringa mede volume, não quantidade de remédio. 5 mg num frasco de 15 mg/0,5 mL são 16,7 unidades; no de 15 mg/1 mL, são 33,3. Trocou de marca, refaça a conta.",
  },
  {
    question: "Serve para qualquer seringa?",
    answer:
      "Só para seringa de insulina U-100, a mais vendida no Brasil. Nela, 100 unidades equivalem a 1 mL. Seringa comum, graduada apenas em mL, não serve para esta conta.",
  },
  {
    question: "O resultado caiu entre dois riscos. E agora?",
    answer:
      "Na seringa de 1 mL os riscos vão de 2 em 2 unidades, então 16,7 fica entre 16 e 18. Pergunte a quem prescreveu como arredondar. As seringas de 0,3 e 0,5 mL marcam de 1 em 1 e deixam a leitura mais precisa em doses pequenas.",
  },
  {
    question: "Dá para tirar várias doses do mesmo frasco?",
    answer:
      "Só se o rótulo indicar multidose. Algumas apresentações são de dose única e não têm conservante: furar a tampa de novo abre caminho para contaminação. Na dúvida, siga a bula do seu produto.",
  },
  {
    question: "Quanto diluente devo colocar no pó?",
    answer:
      "O que estiver na bula ou na prescrição. A calculadora não escolhe esse volume: ela converte a partir do que você colocou. Mais diluente aumenta o número de unidades da mesma dose, sem mudar a quantidade de remédio.",
  },
  {
    question: "A calculadora substitui a orientação médica?",
    answer:
      "Não. Ela faz uma conta. Dose, escalonamento e intervalo são definidos pelo profissional que acompanha você. Na bula da tirzepatida aprovada pela ANVISA, o início é 2,5 mg por semana, com aumentos de 2,5 mg a cada 4 semanas no mínimo, até 15 mg.",
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
          <h1 className="calc-hero__title">Quantas unidades puxar na seringa</h1>
          <p className="calc-hero__lede">
            Escolha o frasco, a seringa e a dose prescrita. A conta converte miligramas em
            unidades da seringa de insulina U-100.
          </p>
        </header>

        <div className="page-shell">
          <Calculator shareUrl={shareUrl} />
        </div>

        <section aria-labelledby="valiq-titulo" className="calc-valiq">
          <div className="calc-valiq__inner page-shell">
            <div>
              <h2 className="calc-valiq__title" id="valiq-titulo">
                Conta certa só adianta com frasco original.
              </h2>
              <p className="calc-valiq__text">
                Aponte a câmera para o QR da caixa. Quem responde é o laboratório que fabricou e a
                DINAVISA, o órgão sanitário do Paraguai.
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
            Esta calculadora faz uma conversão matemática de miligramas para unidades de seringa
            U-100 a partir dos dados que você informa. Ela não indica dose, não substitui
            prescrição nem orientação de profissional de saúde e não verifica se o produto é
            original. Confira sempre o rótulo do frasco e a dose prescrita antes de aplicar.
          </p>
          <p>
            Doses de referência marcadas com ponto: bula da tirzepatida aprovada pela ANVISA.
          </p>
        </aside>
      </main>
      <Footer contactHref={contactHref} />
    </>
  );
}
