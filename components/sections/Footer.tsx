const footerLinks = [
  { label: "Como funciona", href: "/#catalogo" },
  { label: "Rede parceira", href: "/#rede-parceira" },
  { label: "Logística", href: "/#cadeia-de-frio" },
  { label: "Atendimento", href: "/#como-pedir" },
  { label: "Confiança", href: "/#confianca" },
  { label: "Dúvidas", href: "/#faq" },
] as const;

const legalLinks = [
  { label: "Termos de uso", href: "/termos" },
  { label: "Política de privacidade", href: "/privacidade" },
] as const;

export type FooterProps = {
  contactHref?: string;
};

export default function Footer({ contactHref }: FooterProps) {
  return (
    <footer className="site-footer" id="contato">
      <div className="section-shell site-footer__layout">
        <div className="site-footer__brand">
          <a aria-label="Pharmil, voltar ao início" className="site-footer__logo" href="/#inicio">
            PHARMIL
          </a>
          <p>Atendimento claro, conformidade verificada e entrega acompanhada.</p>
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
            <a
              className="button button--secondary"
              href={contactHref}
              rel="noopener noreferrer"
              target="_blank"
            >
              Consultar no WhatsApp
            </a>
          ) : null}
        </div>

        <div className="site-footer__legal">
          <p>
            Conteúdo informativo. A Pharmil atua como intermediária de
            atendimento e logística e não realiza dispensação de medicamentos.
            Este site não substitui avaliação, diagnóstico, prescrição ou
            acompanhamento de profissional de saúde habilitado.
          </p>
          <ul className="site-footer__legal-links">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
          <p>© {new Date().getFullYear()} Pharmil. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
