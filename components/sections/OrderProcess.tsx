const orderSteps = [
  {
    title: "Consulte o item",
    description:
      "Veja as informações disponíveis e identifique quais dados regulatórios ainda precisam ser confirmados.",
  },
  {
    title: "Confirme as condições",
    description:
      "Confirme registro, apresentação, prescrição, origem, disponibilidade e condições logísticas aplicáveis.",
  },
  {
    title: "Siga as orientações",
    description:
      "Somente itens autorizados avançam. A equipe informa acondicionamento, modalidade de entrega e acompanhamento disponível.",
  },
] as const;

export type OrderProcessProps = {
  contactHref?: string;
};

export default function OrderProcess({ contactHref }: OrderProcessProps) {
  return (
    <section
      aria-labelledby="order-process-title"
      className="order-process-section"
      id="como-pedir"
    >
      <div className="section-shell order-process-section__layout">
        <header className="order-process-section__header">
          <h2 className="section-title" id="order-process-title">
            Cada requisito vem antes da confirmação.
          </h2>
          <p className="section-intro">
            O atendimento organiza as informações em uma sequência simples, sem
            esconder restrições, documentação ou condições importantes.
          </p>
        </header>

        <ol className="order-process-section__steps">
          {orderSteps.map((step, index) => (
            <li className="order-step" key={step.title}>
              <span aria-hidden="true" className="order-step__number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="order-step__content">
                <h3 className="order-step__title">{step.title}</h3>
                <p className="order-step__description">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="order-process-section__actions">
          {contactHref ? (
            <a
              className="button button--primary"
              href={contactHref}
              rel="noopener noreferrer"
              target="_blank"
            >
              Consultar disponibilidade no WhatsApp
            </a>
          ) : null}
          <a className="text-link" href="#faq">
            Consultar dúvidas frequentes
          </a>
        </div>
      </div>
    </section>
  );
}
