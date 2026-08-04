const footerLinks = [
  { label: "Produtos", href: "#catalogo" },
  { label: "Linha Pepking", href: "#pepking" },
  { label: "Cadeia de frio", href: "#cadeia-de-frio" },
  { label: "Como pedir", href: "#como-pedir" },
  { label: "Confiança", href: "#confianca" },
  { label: "Dúvidas", href: "#faq" },
] as const;

export type FooterProps = {
  contactHref?: string;
};

export default function Footer({ contactHref }: FooterProps) {
  return (
    <footer className="site-footer" id="contato">
      <div className="section-shell site-footer__layout">
        <div className="site-footer__brand">
          <a aria-label="Pharmil, voltar ao início" className="site-footer__logo" href="#inicio">
            PHARMIL
          </a>
          <p>Procedência visível, atendimento claro e entrega acompanhada.</p>
        </div>

        <nav aria-label="Navegação do rodapé" className="site-footer__navigation">
          <p className="site-footer__heading">Navegue</p>
          <ul>
            {footerLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-footer__contact">
          <p className="site-footer__heading">Atendimento</p>
          <p>
            Consulte disponibilidade, condições de envio e requisitos do produto
            antes de confirmar o pedido.
          </p>
          {contactHref ? (
            <a className="button button--secondary" href={contactHref}>
              Falar com a equipe
            </a>
          ) : null}
        </div>

        <div className="site-footer__legal">
          <p>
            Conteúdo informativo. Não substitui avaliação, diagnóstico,
            prescrição ou acompanhamento de profissional habilitado. Imagens e
            apresentações podem variar conforme disponibilidade.
          </p>
          <p>© {new Date().getFullYear()} Pharmil. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
