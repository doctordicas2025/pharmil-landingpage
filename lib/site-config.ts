const localSiteUrl = "http://localhost:3000";
const whatsappNumber = "5561999969091";
const whatsappGreeting =
  "Olá, vim pelo site da Pharmil e gostaria de consultar a disponibilidade.";
const defaultContactUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappGreeting)}`;

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

export function getWhatsappHref(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Convite do grupo de clientes. Enquanto o link nao existir, os CTAs da pagina
 * /grupo caem no atendimento normal — a pagina converte de qualquer forma e
 * nenhum botao morto vai ao ar.
 *
 * PREENCHER: defina NEXT_PUBLIC_GROUP_URL na Vercel, ou troque a constante.
 */
const groupInviteUrl = "";

export function getGroupHref() {
  return (
    readHttpsUrl(process.env.NEXT_PUBLIC_GROUP_URL)?.toString() ??
    (groupInviteUrl || getContactHref())
  );
}

export function hasGroupLink() {
  return Boolean(
    readHttpsUrl(process.env.NEXT_PUBLIC_GROUP_URL) || groupInviteUrl,
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
