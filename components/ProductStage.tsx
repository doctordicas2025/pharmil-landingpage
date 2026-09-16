const pillars = [
  {
    label: "Atendimento",
    description: "Orientação conduzida por equipe, do primeiro contato à confirmação.",
  },
  {
    label: "Conformidade",
    description: "Registro, origem e requisitos verificados antes de qualquer envio.",
  },
  {
    label: "Logística",
    description: "Acondicionamento definido por rota e acompanhamento até a entrega.",
  },
] as const;

export function ProductStage() {
  return (
    <figure className="product-stage">
      <div className="product-stage__panel">
        <ul className="stage-pillars">
          {pillars.map((pillar, index) => (
            <li className="stage-pillar" key={pillar.label}>
              <span aria-hidden="true" className="stage-pillar__index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <strong className="stage-pillar__label">{pillar.label}</strong>
                <p className="stage-pillar__description">{pillar.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <figcaption className="product-stage__caption">
        <span className="product-stage__caption-title">
          <span aria-hidden="true" />
          Como atendemos
        </span>
        <small>Condições e prazos confirmados durante o atendimento.</small>
      </figcaption>
    </figure>
  );
}
