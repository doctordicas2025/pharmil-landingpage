import type { ReactNode } from "react";
import Link from "next/link";

import {
  getInstitutionalContactHref,
  InstitutionalFooter,
  InstitutionalHeader,
} from "@/components/funnel/InstitutionalPortal";
import { companyInfo } from "@/lib/site-config";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  const contactHref = getInstitutionalContactHref();

  return (
    <>
      <InstitutionalHeader contactHref={contactHref} />
      <main className="legal-page">
        <div className="legal-shell">
          <header className="legal-page__header">
            <p className="legal-page__eyebrow">Documento legal</p>
            <h1 className="legal-page__title">{title}</h1>
            <p className="legal-page__updated">
              Vigente desde {companyInfo.effectiveDate} &middot; Última
              atualização: {companyInfo.lastUpdated}
            </p>
          </header>

          <div className="legal-page__body">
            {children}
            <ul>
              <li>
                <strong>E-mail:</strong> {companyInfo.email}
              </li>
              <li>
                <strong>Telefone:</strong> {companyInfo.phone}
              </li>
              <li>
                <strong>Endereço:</strong> {companyInfo.address}
              </li>
            </ul>

            <Link className="legal-back" href="/">
              <span aria-hidden="true">←</span> Voltar para a página inicial
            </Link>
          </div>
        </div>
      </main>
      <InstitutionalFooter />
    </>
  );
}
