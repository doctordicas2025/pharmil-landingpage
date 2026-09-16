const faqItems = [
  {
    question: "O que exatamente a Pharmil faz?",
    answer:
      "Atuamos como intermediários entre você e farmácias parceiras habilitadas. Organizamos o atendimento, a verificação de requisitos e a logística de entrega. Não realizamos dispensação nem comercializamos medicamentos diretamente.",
  },
  {
    question: "Preciso de receita médica?",
    answer:
      "Sim, sempre que o item exigir. Itens sujeitos à prescrição só podem ser dispensados com receita válida e acompanhamento de profissional de saúde habilitado. A equipe informa os requisitos antes de seguir com qualquer solicitação.",
  },
  {
    question: "Como é feita a entrega?",
    answer:
      "A modalidade é definida conforme o destino e a disponibilidade logística. Prazo estimado, acondicionamento e forma de acompanhamento são informados antes da confirmação.",
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "As opções disponíveis e o valor total são confirmados durante o atendimento. Use apenas os canais oficiais da Pharmil e confira os dados do destinatário antes de realizar qualquer pagamento.",
  },
  {
    question: "Como solicito um cancelamento ou reembolso?",
    answer:
      "Solicitações podem ser feitas pelo mesmo canal de atendimento. As condições de cancelamento, troca e reembolso seguem o Código de Defesa do Consumidor e estão detalhadas nos nossos Termos de Uso.",
  },
  {
    question: "Como meus dados pessoais são tratados?",
    answer:
      "Coletamos apenas os dados necessários para o atendimento e a logística, conforme a LGPD. Você pode solicitar acesso, correção ou exclusão a qualquer momento. Os detalhes estão na Política de Privacidade.",
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
          atendimento diretamente com a equipe.
        </p>
      </div>
    </section>
  );
}
