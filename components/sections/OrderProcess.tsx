const steps = [
  {
    title: "Você escolhe",
    description:
      "Manda o produto e a dosagem pelo WhatsApp. Confirmamos lote e disponibilidade na hora.",
  },
  {
    title: "Conferimos",
    description:
      "Origem, validade e a orientação profissional que acompanha o pedido.",
  },
  {
    title: "Pagamento",
    description:
      "PIX à vista ou cartão. Nota e comprovante enviados na mesma conversa.",
  },
  {
    title: "Envio e rastreio",
    description:
      "Caixa térmica lacrada, foto do lacre e código de rastreio no mesmo dia.",
  },
] as const;

export default function OrderProcess() {
  return (
    <section
      aria-labelledby="order-process-title"
      className="order-process"
      id="como-pedir"
    >
      <h2 className="section-title" id="order-process-title">
        Quatro passos, sem enrolação.
      </h2>

      <ol className="order-process__steps">
        {steps.map((step, index) => (
          <li className="order-step" key={step.title}>
            <span aria-hidden="true" className="order-step__number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <strong className="order-step__title">{step.title}</strong>
            <p className="order-step__description">{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
