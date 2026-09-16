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

export const companyInfo = {
  legalName: "DOCTOR INSTITUIÇÃO DE PAGAMENTO LTDA",
  tradeName: "Pharmil",
  cnpj: "60.273.707/0001-01",
  address:
    "SAUS Quadra 5, Bloco N, s/n, Sala 307, Edifício OAB — Asa Sul, Brasília/DF, CEP 70.070-913",
  email: "doctorminuto2025@gmail.com",
  phone: "+55 (11) 92474-0935",
  jurisdiction: "Brasília/DF",
  effectiveDate: "13 de agosto de 2026",
  lastUpdated: "16 de setembro de 2026",
} as const;
