"use client";

import { useState } from "react";

const faqItems = [
  {
    question: "Preciso de receita médica?",
    answer:
      "Sim, sempre que o item exigir. A dispensação é feita por farmácia parceira habilitada, mediante receita válida e acompanhamento de profissional de saúde. A equipe informa os requisitos antes de fechar o pedido.",
  },
  {
    question: "Como sei a procedência do lote?",
    answer:
      "Cada lote tem laudo de análise disponível. Peça no atendimento antes de confirmar: enviamos o laudo, a validade e a foto da embalagem do lote que vai no seu pedido.",
  },
  {
    question: "Como é feita a entrega?",
    answer:
      "Caixa térmica lacrada, com faixa de 2 a 8 °C mantida na rota e autonomia de até 48 horas. Você recebe foto do lacre e o código de rastreio no mesmo dia do envio.",
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "PIX à vista, com o preço que aparece na lojinha, ou cartão. Nota e comprovante são enviados na mesma conversa. Use apenas os canais oficiais da Pharmil e confira os dados antes de pagar.",
  },
  {
    question: "Como solicito cancelamento ou reembolso?",
    answer:
      "Pelo mesmo canal de atendimento. As condições seguem o Código de Defesa do Consumidor e estão detalhadas nos Termos de Uso. Por determinação sanitária, itens com embalagem violada não podem ser devolvidos, salvo vício ou avaria de transporte.",
  },
  {
    question: "Como meus dados pessoais são tratados?",
    answer:
      "Coletamos apenas o necessário para o atendimento e a entrega, conforme a LGPD. Você pode pedir acesso, correção ou exclusão a qualquer momento. Os detalhes estão na Política de Privacidade.",
  },
] as const;

export type FaqProps = {
  contactHref: string;
};

export default function Faq({ contactHref }: FaqProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section aria-labelledby="faq-title" className="faq" id="faq">
      <div className="faq__inner">
        <div className="faq__intro">
          <h2 className="section-title" id="faq-title">
            Dúvidas frequentes.
          </h2>
          <p className="section-intro">
            Se a sua pergunta não estiver aqui, é mais rápido no WhatsApp —
            respondemos em minutos no horário comercial.
          </p>
          <a
            className="faq__link"
            href={contactHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            Perguntar agora <span aria-hidden="true">→</span>
          </a>
        </div>

        <ul className="faq__list">
          {faqItems.map((item, index) => {
            const open = openIndex === index;
            return (
              <li className="faq-item" key={item.question}>
                <button
                  aria-expanded={open}
                  className="faq-item__question"
                  onClick={() => setOpenIndex(open ? -1 : index)}
                  type="button"
                >
                  {item.question}
                  <span aria-hidden="true" className="faq-item__marker">
                    {open ? "−" : "+"}
                  </span>
                </button>
                {open ? <p className="faq-item__answer">{item.answer}</p> : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
