import Image from "next/image";
import Link from "next/link";

import { companyInfo } from "@/lib/site-config";

const navLinks = [
  { label: "Produtos", href: "/#loja" },
  { label: "Cadeia de frio", href: "/#cadeia-de-frio" },
  { label: "Como pedir", href: "/#como-pedir" },
  { label: "Dúvidas", href: "/#faq" },
] as const;

export type FooterProps = {
  contactHref?: string;
};

export default function Footer({ contactHref }: FooterProps) {
  return (
    <footer className="site-footer" id="contato">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Link className="site-footer__logo" href="/#inicio">
            <Image alt="" height={42} src="/images/pharmil-logo.jpg" width={42} />
            <span>Pharmil</span>
          </Link>
          <p>Procedência visível, atendimento claro e entrega acompanhada.</p>
        </div>

        <nav aria-label="Navegação do rodapé">
          <p className="site-footer__heading">Navegar</p>
          <ul className="site-footer__list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="site-footer__heading">Contato</p>
          <ul className="site-footer__list">
            <li>
              <a
                href={contactHref}
                rel="noopener noreferrer"
                target="_blank"
              >
                WhatsApp (61) 99996-9091
              </a>
            </li>
            <li>{companyInfo.email}</li>
            <li className="site-footer__address">
              SAUS Q. 5, Bloco N, Sala 307
              <br />
              Asa Sul, Brasília/DF
            </li>
          </ul>
        </div>

        <div>
          <p className="site-footer__heading">Legal</p>
          <ul className="site-footer__list">
            <li>
              <Link href="/termos">Termos de uso</Link>
            </li>
            <li>
              <Link href="/privacidade">Privacidade</Link>
            </li>
            <li className="site-footer__address">CNPJ {companyInfo.cnpj}</li>
          </ul>
        </div>
      </div>

      <div className="site-footer__legal">
        <div className="site-footer__legal-inner">
          <p>
            Conteúdo informativo. Não substitui avaliação profissional e não promete
            resultados. Dispensação por farmácia parceira habilitada, mediante
            prescrição.
          </p>
          <p className="site-footer__entity">
            PHARMIL&reg; | Marca comercial operada por {companyInfo.legalName}. &mdash;
            CNPJ {companyInfo.cnpj}
          </p>
          <p>© {new Date().getFullYear()} Pharmil</p>
        </div>
      </div>
    </footer>
  );
}
