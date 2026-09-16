const networkItems = [
  {
    name: "Farmácias habilitadas",
    status: "Dispensação feita por estabelecimento regularizado",
  },
  {
    name: "Documentação verificada",
    status: "Registro e origem confirmados a cada pedido",
  },
  {
    name: "Cobertura nacional",
    status: "Rotas e prazos informados conforme o destino",
  },
] as const;

export default function Pepking() {
  return (
    <section
      className="pepking-section"
      id="rede-parceira"
      aria-labelledby="pepking-title"
    >
      <div className="section-shell pepking-section__layout">
        <header className="pepking-section__header">
          <p className="pepking-section__label">Rede parceira</p>
          <h2 className="section-title" id="pepking-title">
            Quem entrega está habilitado para isso.
          </h2>
          <p className="section-intro">
            A Pharmil não dispensa nem comercializa medicamentos. Atuamos como
            intermediários: organizamos o atendimento e a logística, enquanto a
            dispensação fica a cargo de farmácias parceiras regularizadas.
          </p>
          <a className="button button--secondary" href="#cadeia-de-frio">
            Entender o acondicionamento
          </a>
        </header>

        <div
          className="pepking-section__manifest"
          aria-label="Critérios da rede parceira"
        >
          <p className="pepking-section__manifest-title">Critérios da rede</p>
          <ul>
            {networkItems.map((item, index) => (
              <li key={item.name}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.name}</strong>
                <small>{item.status}</small>
              </li>
            ))}
          </ul>
          <p className="pepking-section__note">
            Toda dispensação depende de prescrição válida e acompanhamento de
            profissional de saúde habilitado.
          </p>
        </div>
      </div>
    </section>
  );
}
