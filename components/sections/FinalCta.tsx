export type FinalCtaProps = {
  contactHref: string;
};

export default function FinalCta({ contactHref }: FinalCtaProps) {
  return (
    <section aria-labelledby="cta-title" className="final-cta">
      <div className="final-cta__inner">
        <div>
          <h2 className="final-cta__title" id="cta-title">
            Fale com quem vai acompanhar seu pedido.
          </h2>
          <p className="final-cta__lede">
            Sem robô e sem formulário longo. Você manda o produto, a gente confirma
            o lote e resolve na conversa.
          </p>
        </div>

        <div className="final-cta__action">
          <a
            className="final-cta__button"
            href={contactHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            Chamar no WhatsApp <span aria-hidden="true">→</span>
          </a>
          <p className="final-cta__hours">
            Seg a sáb, 9h às 19h · resposta média em 4 minutos
          </p>
        </div>
      </div>
    </section>
  );
}
