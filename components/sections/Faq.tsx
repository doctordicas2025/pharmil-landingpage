const faqItems = [
  {
    question: "Como confirmo a procedência dos produtos?",
    answer:
      "Antes da compra, peça à equipe as informações de origem, identificação e documentação disponível para o item. Conclua o pedido somente quando esses dados estiverem claros para você.",
  },
  {
    question: "Como é feita a entrega?",
    answer:
      "A modalidade é definida conforme o produto, o destino e a disponibilidade logística. Prazo estimado, acondicionamento e forma de acompanhamento são informados antes da confirmação.",
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "As opções disponíveis e o valor total são confirmados no atendimento. Use apenas os canais oficiais da Pharmil e confira os dados do destinatário antes de realizar qualquer pagamento.",
  },
  {
    question: "Como funcionam os preços por quantidade?",
    answer:
      "A equipe prepara uma cotação atualizada de acordo com o item, a quantidade e a disponibilidade. Não considere como vigente uma condição que não tenha sido confirmada no atendimento.",
  },
  {
    question: "Preciso de receita médica?",
    answer:
      "Produtos sujeitos à prescrição somente devem ser adquiridos e utilizados com receita e acompanhamento profissional, conforme as exigências aplicáveis. A equipe informa os requisitos antes de seguir com o pedido.",
  },
  {
    question: "Como devo conservar o produto depois de receber?",
    answer:
      "Siga o rótulo, as orientações de entrega e a recomendação do profissional responsável. Se a embalagem chegar violada ou em condição diferente da esperada, não utilize o produto antes de buscar orientação.",
  },
] as const;

export default function Faq() {
  return (
    <section aria-labelledby="faq-title" className="faq-section" id="faq">
      <div className="section-shell faq-section__layout">
        <header className="faq-section__header">
          <h2 className="section-title" id="faq-title">
            Perguntas que merecem respostas diretas.
          </h2>
          <p className="section-intro">
            Reunimos os pontos mais importantes para você chegar ao atendimento
            com mais contexto.
          </p>
        </header>

        <div className="faq-section__items">
          {faqItems.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary className="faq-item__question">
                <span>{item.question}</span>
                <span aria-hidden="true" className="faq-item__marker">
                  +
                </span>
              </summary>
              <div className="faq-item__answer">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>

        <p className="faq-section__note">
          Ainda ficou alguma dúvida? Confirme as condições específicas do seu
          pedido diretamente com a equipe antes de comprar.
        </p>
      </div>
    </section>
  );
}
