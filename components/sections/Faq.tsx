import { Accordion, TextLink } from "@/design-system";

const faqItems = [
  {
    question: "Como funciona a logística refrigerada de 2°C a 8°C?",
    answer:
      "Todos os envios saem em caixa térmica lacrada com elementos refrigerantes calibrados para manter a faixa de 2°C a 8°C por até 48 horas. Você recebe foto do lacre e código de rastreio no mesmo dia da postagem.",
  },
  {
    question: "Como é feita a conferência de lote antes do envio?",
    answer:
      "Antes de fechar a caixa térmica, nossa equipe confere lote, validade e integridade da embalagem e envia as informações diretamente na conversa do WhatsApp para você validar.",
  },
  {
    question: "Como funciona o atendimento no WhatsApp?",
    answer:
      "Nosso suporte é 100% humano pelo canal oficial. Você informa a linha e a concentração desejada, tiramos dúvidas sobre envio, prazo e conservação, e acompanhamos até a entrega.",
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "PIX à vista, com o valor exibido no catálogo, ou cartão. Comprovante e atualização do pedido são enviados na mesma conversa. Utilize sempre os canais oficiais da Pharmil.",
  },
  {
    question: "Como solicito troca, cancelamento ou suporte pós-entrega?",
    answer:
      "Pelo mesmo canal oficial de WhatsApp. Caso haja qualquer divergência ou avaria no transporte, nossa equipe analisa imediatamente e providencia a solução conforme nossos Termos de Uso.",
  },
  {
    question: "Como meus dados pessoais são protegidos?",
    answer:
      "Coletamos apenas o necessário para o atendimento e o rastreamento logístico, em conformidade com a LGPD. Os detalhes completos estão na nossa Política de Privacidade.",
  },
] as const;

export type FaqProps = {
  contactHref: string;
};

export default function Faq({ contactHref }: FaqProps) {
  return (
    <section aria-labelledby="faq-title" className="faq" id="faq">
      <div className="faq__inner">
        <div className="faq__intro">
          <h2 className="section-title" id="faq-title">
            Dúvidas frequentes.
          </h2>
          <p className="section-intro">
            Se a sua pergunta não estiver aqui, é mais rápido no WhatsApp —
            nossa equipe responde em minutos no horário comercial.
          </p>
          <div className="faq__action">
            <TextLink external href={contactHref}>
              Perguntar agora
            </TextLink>
          </div>
        </div>

        <Accordion items={faqItems} />
      </div>
    </section>
  );
}
