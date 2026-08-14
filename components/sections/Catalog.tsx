const products = [
  {
    name: "Tirzepatida",
    description:
      "Somente apresentações com registro sanitário válido e mediante os requisitos de prescrição aplicáveis.",
  },
  {
    name: "Retatrutida",
    description:
      "Substância experimental, ainda sem aprovação sanitária e indisponível para comercialização.",
  },
  {
    name: "GHK-Cu",
    description:
      "Classificação, finalidade e regularização devem ser confirmadas para cada apresentação antes de qualquer divulgação.",
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
            Produtos apresentados com clareza.
          </h2>
          <p className="section-intro">
            Cada item é apresentado com transparência regulatória. Apresentação,
            procedência, registro e condições de distribuição são confirmados
            durante o atendimento.
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

        <ol aria-label="Produtos Pharmil" className="catalog-section__products">
          {products.map((product, index) => (
            <li className="catalog-section__item" key={product.name}>
              <article className="product-card">
                <span aria-hidden="true" className="product-card__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="product-card__content">
                <p className="product-card__meta">Situação regulatória</p>
                  <h3 className="product-card__title">{product.name}</h3>
                  <p className="product-card__description">
                    {product.description}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ol>

        <aside
          aria-label="Informação importante sobre o catálogo"
          className="catalog-section__notice"
        >
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
            <circle cx="12" cy="12" fill="none" r="9" stroke="currentColor" />
            <path d="M12 10v6M12 7.5v.5" stroke="currentColor" />
          </svg>
          <p>
            <strong>Informação importante.</strong> Registro, origem, prescrição e
            autorização de comercialização são verificados conforme o item e a
            apresentação.
          </p>
        </aside>
      </div>
    </section>
  );
}
