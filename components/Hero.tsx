import { ProductStage } from "./ProductStage";

const trustSignals = [
  {
    number: "01",
    title: "Disponibilidade confirmada",
    detail: "durante o atendimento",
  },
  {
    number: "02",
    title: "Conservação orientada",
    detail: "de acordo com o produto",
  },
  {
    number: "03",
    title: "Envio acompanhado",
    detail: "até a etapa de entrega",
  },
] as const;

export function Hero() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero__inner page-shell">
        <div className="hero__copy">
          <p className="hero__eyebrow">
            <span aria-hidden="true" />
            Catálogo e atendimento Pharmil
          </p>

          <h1 id="hero-title">
            Informação clara.
            <span>Cuidado em cada etapa.</span>
          </h1>

          <p className="hero__description">
            Conheça como a Pharmil organiza procedência, conservação e logística.
            Produtos sujeitos a controle dependem de registro válido, prescrição
            e confirmação dos requisitos aplicáveis.
          </p>

          <div className="hero__actions" aria-label="Ações principais">
            <a className="button button--primary" href="#catalogo">
              Consultar informações
              <span aria-hidden="true">→</span>
            </a>
            <a className="button button--secondary" href="#como-pedir">
              Entender o processo
            </a>
          </div>
        </div>

        <div className="hero__visual">
          <ProductStage />
        </div>
      </div>

      <div className="trust-rail page-shell" aria-label="Como cuidamos do pedido">
        <p className="trust-rail__intro">Do atendimento à entrega</p>
        <ul>
          {trustSignals.map((signal) => (
            <li key={signal.number}>
              <span className="trust-rail__number" aria-hidden="true">
                {signal.number}
              </span>
              <span>
                <strong>{signal.title}</strong>
                <small>{signal.detail}</small>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
