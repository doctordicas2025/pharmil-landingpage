const steps = [
  {
    name: "Consultoria orientada",
    description:
      "A equipe entende sua necessidade e indica quais requisitos precisam ser confirmados antes de seguir.",
  },
  {
    name: "Conformidade confirmada",
    description:
      "Origem, registro e autorização são verificados junto à farmácia parceira responsável pela dispensação.",
  },
  {
    name: "Entrega acompanhada",
    description:
      "Acondicionamento, prazo e rastreamento são definidos conforme a rota e informados antes da confirmação.",
  },
] as const;

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="button__icon"
      focusable="false"
      viewBox="0 0 20 20"
    >
      <path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="currentColor" />
    </svg>
  );
}

export type CatalogProps = {
  contactHref: string;
};

export default function Catalog({ contactHref }: CatalogProps) {
  return (
    <section
      aria-labelledby="catalog-title"
      className="catalog-section"
      id="catalogo"
    >
      <div className="section-shell catalog-section__layout">
        <header className="catalog-section__header">
          <h2 className="section-title" id="catalog-title">
            Um processo explicado do início ao fim.
          </h2>
          <p className="section-intro">
            Somos intermediários entre você e farmácias parceiras. Cada etapa é
            conduzida com transparência, e as condições são confirmadas durante o
            atendimento.
          </p>
          <a
            className="button button--primary"
            href={contactHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            Consultar no WhatsApp
            <ArrowIcon />
          </a>
        </header>

        <ol aria-label="Etapas do atendimento" className="catalog-section__products">
          {steps.map((step, index) => (
            <li className="catalog-section__item" key={step.name}>
              <article className="product-card">
                <span aria-hidden="true" className="product-card__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="product-card__content">
                <p className="product-card__meta">Etapa</p>
                  <h3 className="product-card__title">{step.name}</h3>
                  <p className="product-card__description">
                    {step.description}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ol>

        <aside
          aria-label="Informação importante sobre o atendimento"
          className="catalog-section__notice"
        >
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
            <circle cx="12" cy="12" fill="none" r="9" stroke="currentColor" />
            <path d="M12 10v6M12 7.5v.5" stroke="currentColor" />
          </svg>
          <p>
            <strong>Informação importante.</strong> A dispensação é realizada por
            farmácia parceira habilitada, mediante prescrição e acompanhamento de
            profissional de saúde, conforme as exigências aplicáveis.
          </p>
        </aside>
      </div>
    </section>
  );
}
