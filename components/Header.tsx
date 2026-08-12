import Image from "next/image";

const navigation = [
  { href: "#catalogo", label: "Catálogo" },
  { href: "#pepking", label: "Linha Pepking" },
  { href: "#cadeia-de-frio", label: "Cadeia fria" },
  { href: "#como-pedir", label: "Como pedir" },
  { href: "#confianca", label: "Por que a Pharmil" },
  { href: "#faq", label: "Dúvidas" },
] as const;

function Brand() {
  return (
    <a className="brand" href="#inicio" aria-label="Pharmil, voltar ao início">
      <span className="brand__logo-crop" aria-hidden="true">
        <Image
          className="brand__logo"
          src="/brand/pharmil-logo.jpg"
          alt=""
          width={1254}
          height={1254}
          sizes="132px"
        />
      </span>
    </a>
  );
}

function NavigationLinks({ mobile = false }: { mobile?: boolean }) {
  return (
    <ul className={mobile ? "nav-links nav-links--mobile" : "nav-links"}>
      {navigation.map((item) => (
        <li key={item.href}>
          <a href={item.href}>{item.label}</a>
        </li>
      ))}
    </ul>
  );
}

export type HeaderProps = {
  contactHref: string;
};

export function Header({ contactHref }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header__inner page-shell">
        <Brand />

        <nav className="desktop-nav" aria-label="Navegação principal">
          <NavigationLinks />
        </nav>

        <a
          className="button button--primary header-cta"
          href={contactHref}
          rel="noopener noreferrer"
          target="_blank"
        >
          Falar no WhatsApp
          <span aria-hidden="true">→</span>
        </a>

        <details className="mobile-menu">
          <summary className="mobile-menu__trigger">
            <span>Menu</span>
            <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
              <path d="M3 6h14M3 10h14M3 14h14" />
            </svg>
          </summary>
          <nav className="mobile-menu__panel" aria-label="Navegação mobile">
            <NavigationLinks mobile />
            <a
              className="button button--primary mobile-menu__cta"
              href={contactHref}
              rel="noopener noreferrer"
              target="_blank"
            >
              Falar no WhatsApp
              <span aria-hidden="true">→</span>
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}
