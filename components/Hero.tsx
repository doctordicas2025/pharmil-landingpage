import Image from "next/image";

import { Button, Chip, DotPill, TextLink } from "@/design-system";

const chips = [
  {
    label: ["Laudo de análise", "por lote"],
    stroke: "var(--color-wine)",
    path: <><path d="M7 3h7l4 4v14H7z" /><path d="M10 12h5M10 16h5" /></>,
  },
  {
    label: ["Envio entre", "2 e 8 °C"],
    stroke: "var(--color-navy)",
    path: <path d="M12 3v18M6.5 6.5l5.5-3.5 5.5 3.5M6.5 17.5l5.5 3.5 5.5-3.5M4 12h16" />,
  },
  {
    label: ["Rastreio no", "mesmo dia"],
    stroke: "var(--color-orange)",
    path: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  },
] as const;

export type HeroProps = {
  contactHref: string;
};

export function Hero({ contactHref }: HeroProps) {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div aria-hidden="true" className="hero__halo" />

      <div className="hero__inner">
        <div className="hero__copy">
          <DotPill>Tecnologia em peptídeos</DotPill>

          <h1 className="hero__title" id="hero-title">
            O padrão Pharmil em
            <br />
            <em>peptídeos injetáveis</em>
            <br />
            de alta pureza.
          </h1>

          <p className="hero__lede">
            Tirzepatida, Retatrutida, GHK-Cu e blends — com laudo do lote, cadeia
            de frio e rastreio informados antes de você confirmar.
          </p>

          <ul className="hero__chips">
            {chips.map((chip) => (
              <li key={chip.label.join(" ")}>
                <Chip
                  icon={
                    <svg
                      fill="none"
                      height="18"
                      stroke={chip.stroke}
                      strokeWidth="1.7"
                      viewBox="0 0 24 24"
                      width="18"
                    >
                      {chip.path}
                    </svg>
                  }
                >
                  {chip.label[0]}
                  <br />
                  {chip.label[1]}
                </Chip>
              </li>
            ))}
          </ul>

          <div className="hero__actions">
            <Button href={contactHref} rel="noopener noreferrer" target="_blank">
              Garanta o seu agora
              <span aria-hidden="true">→</span>
            </Button>
            <TextLink href="#loja">Ver todos os produtos</TextLink>
          </div>

          <p className="hero__fineprint">
            Produtos de alta pureza &nbsp;|&nbsp; Uso sob orientação profissional
          </p>
        </div>

        <div className="showcase">
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
              sizes="(max-width: 992px) 92vw, 660px"
              src="/images/hero-podium.png"
              width={1632}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
