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
