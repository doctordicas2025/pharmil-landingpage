const localSiteUrl = "http://localhost:3000";
const defaultContactUrl = "/cadastro";

function readHttpsUrl(value: string | undefined) {
  if (!value) return undefined;
  
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url : undefined;
  } catch (e) {
    // Se for um path relativo (como /cadastro), retorna a string
    if (value.startsWith('/')) return value;
    return undefined;
  }
}

export function getSiteUrl() {
  return readHttpsUrl(process.env.NEXT_PUBLIC_SITE_URL) ?? new URL(localSiteUrl);
}

export function getContactHref() {
  return (
    readHttpsUrl(process.env.NEXT_PUBLIC_CONTACT_URL)?.toString() ??
    defaultContactUrl
  );
}

// PREENCHER antes de submeter à análise do gateway de pagamento.
export const companyInfo = {
  legalName: "[RAZÃO SOCIAL COMPLETA]",
  tradeName: "Pharmil",
  cnpj: "[00.000.000/0001-00]",
  address: "[Endereço completo, cidade/UF, CEP]",
  email: "[contato@pharmil.com.br]",
  phone: "[(00) 00000-0000]",
  jurisdiction: "[Comarca/UF]",
  lastUpdated: "16 de setembro de 2026",
} as const;
