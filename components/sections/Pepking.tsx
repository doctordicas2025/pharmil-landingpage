const lineItems = [
  {
    name: "GHK-Cu",
    status: "Apresentação e finalidade sob validação",
  },
  {
    name: "Tirzepatida",
    status: "Somente apresentação regularizada e prescrita",
  },
  {
    name: "Retatrutida",
    status: "Experimental e indisponível para comercialização",
  },
] as const;

export default function Pepking() {
  return (
    <section className="pepking-section" id="pepking" aria-labelledby="pepking-title">
      <div className="section-shell pepking-section__layout">
        <header className="pepking-section__header">
          <p className="pepking-section__label">Linha Pepking</p>
          <h2 className="section-title" id="pepking-title">
            Detalhe técnico vem com documento.
          </h2>
          <p className="section-intro">
            A linha de peptídeos permanece na arquitetura original. Pureza,
            concentração, origem e uso só devem ser publicados com documentação
            válida para a apresentação e o lote correspondentes.
          </p>
          <a className="button button--secondary" href="#cadeia-de-frio">
            Entender o acondicionamento
          </a>
        </header>

        <div className="pepking-section__manifest" aria-label="Itens citados na linha Pepking">
          <p className="pepking-section__manifest-title">Manifesto de linha</p>
          <ul>
            {lineItems.map((item, index) => (
              <li key={item.name}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.name}</strong>
                <small>{item.status}</small>
              </li>
            ))}
          </ul>
          <p className="pepking-section__note">
            Laudos, registros e dados do lote são a base para confirmar as
            informações de cada apresentação.
          </p>
        </div>
      </div>
    </section>
  );
}
