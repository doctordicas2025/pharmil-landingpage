const networkItems = [
  {
    title: "Farmácias habilitadas",
    detail: "Dispensação por estabelecimento regularizado",
  },
  {
    title: "Documentação verificada",
    detail: "Registro e origem confirmados a cada pedido",
  },
  {
    title: "Cobertura nacional",
    detail: "Rotas e prazos informados conforme o destino",
  },
] as const;

export type TrustProps = {
  contactHref: string;
};

export default function Trust({ contactHref }: TrustProps) {
  return (
    <section aria-labelledby="rede-title" className="network" id="rede">
      <div className="network__inner">
        <div>
          <p className="network__label">Rede parceira</p>
          <h2 className="section-title" id="rede-title">
            Quem dispensa está habilitado para isso.
          </h2>
          <p className="section-intro">
            A Pharmil organiza o atendimento e a logística. A dispensação fica com
            farmácias parceiras regularizadas, mediante prescrição válida.
          </p>
          <a
            className="network__link"
            href={contactHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            Tirar uma dúvida <span aria-hidden="true">→</span>
          </a>
        </div>

        <ul className="network__list">
          {networkItems.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <small>{item.detail}</small>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
