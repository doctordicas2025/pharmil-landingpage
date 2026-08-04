const coldChainStages = [
  {
    title: "Conferência do pedido",
    description:
      "Produto, destino e necessidades de transporte são revisados antes do envio.",
  },
  {
    title: "Acondicionamento adequado",
    description:
      "Quando há exigência térmica, a embalagem é definida de acordo com o item e a rota.",
  },
  {
    title: "Envio acompanhado",
    description:
      "A modalidade, a previsão e os dados de rastreamento disponíveis são compartilhados.",
  },
  {
    title: "Recebimento orientado",
    description:
      "Você recebe orientações para conferir a embalagem e agir caso perceba alguma alteração.",
  },
] as const;

function ThermometerIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 64 64">
      <path
        d="M25 38.5V13a7 7 0 0 1 14 0v25.5a13 13 0 1 1-14 0Z"
        fill="none"
        stroke="currentColor"
      />
      <path d="M32 18v26" stroke="currentColor" />
      <circle cx="32" cy="49" fill="currentColor" r="5" />
      <path d="M45 18h8M45 26h5M45 34h8" stroke="currentColor" />
    </svg>
  );
}

export default function ColdChain() {
  return (
    <section
      aria-labelledby="cold-chain-title"
      className="cold-chain-section"
      id="cadeia-de-frio"
    >
      <div className="section-shell cold-chain-section__layout">
        <header className="cold-chain-section__header">
          <div className="cold-chain-section__symbol">
            <ThermometerIcon />
            <span>Cuidado térmico</span>
          </div>
          <h2 className="section-title" id="cold-chain-title">
            A cadeia de frio começa antes da embalagem.
          </h2>
          <p className="section-intro">
            O cuidado está nas decisões de cada etapa: entender o produto,
            preparar o envio para a rota e explicar como acompanhar o pedido até
            o recebimento.
          </p>
        </header>

        <ol className="cold-chain-section__stages">
          {coldChainStages.map((stage, index) => (
            <li className="cold-chain-stage" key={stage.title}>
              <span aria-hidden="true" className="cold-chain-stage__number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="cold-chain-stage__title">{stage.title}</h3>
                <p className="cold-chain-stage__description">
                  {stage.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="cold-chain-section__caveat">
          Prazo, tipo de embalagem e rastreamento variam conforme produto,
          localidade e modalidade disponível. Confirme essas condições antes do
          pagamento.
        </p>
      </div>
    </section>
  );
}
