const localSiteUrl = "http://localhost:3000";
const defaultContactUrl = "https://wa.me/5561999969091";

function readHttpsUrl(value: string | undefined) {
  if (!value || !URL.canParse(value)) {
    return undefined;
  }

  const url = new URL(value);
  return url.protocol === "https:" ? url : undefined;
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
