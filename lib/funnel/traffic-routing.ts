// =============================================================
// Pharmil — Edge Traffic Routing & Bot Filtering (/avaliacao e /vip)
//
// Módulo puro (sem imports de Node ou bibliotecas externas).
// Valida parâmetros de origem (utm_source, fbclid, ttclid), filtra
// crawlers/automação, reescreve tráfego sem atribuição para /institucional
// (mantendo a URL original na barra de endereços) e direciona tráfego
// mobile atribuído de /vip diretamente ao Grupo VIP oficial no WhatsApp.
// =============================================================

export const ATTRIBUTION_COOKIE_NAME = "pharmil_attr";
export const ATTRIBUTION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 dias

const AVALIACAO_PREFIX = "/avaliacao";
const VIP_PREFIX = "/vip";
export const INSTITUTIONAL_FALLBACK_PATH = "/institucional";
export const DEFAULT_WHATSAPP_VIP_GROUP_URL =
  "https://chat.whatsapp.com/JcIISmSCGo28QDWYeQtmDX?s=cl&p=i&iam=2";

/**
 * Navegadores embutidos reais de mídia paga (Meta e TikTok).
 * Nunca devem ser classificados como bots/crawlers.
 */
const IN_APP_AD_BROWSER_PATTERN =
  /\b(FBAN|FBAV|FB_IAB|FBIOS|Instagram|TikTok|musical_ly|ByteLocale|BytedanceWebview|Line\/)\b/i;

/**
 * Sinais de dispositivo móvel para redirecionamento 1-clique em /vip.
 */
const MOBILE_UA_PATTERN =
  /\b(Android|iPhone|iPad|iPod|Mobile|IEMobile|Opera Mini|BlackBerry|webOS)\b/i;

/**
 * Crawlers conhecidos, preview fetchers, browsers headless e clientes HTTP.
 */
const AUTOMATED_UA_PATTERN =
  /\b(bot|crawler|spider|slurp|mediapartners|facebookexternalhit|facebot|meta-externalagent|meta-externalfetcher|bytespider|tiktokbot|googlebot|adsbot-google|bingbot|yandexbot|duckduckbot|baiduspider|semrushbot|ahrefsbot|mj12bot|dotbot|petalbot|applebot|twitterbot|linkedinbot|whatsapp|telegrambot|discordbot|slackbot|headlesschrome|phantomjs|playwright|puppeteer|selenium|webdriver|cypress|lighthouse|chrome-lighthouse|curl|wget|python-requests|python-urllib|httpx|aiohttp|axios|go-http-client|java\/|libwww-perl|scrapy|postmanruntime)\b/i;

/**
 * ASNs típicos de provedores de nuvem/data centers usados em scraping automatizado.
 * Aplicado somente quando o request NÃO se identifica como navegador in-app legítimo.
 */
const DATACENTER_ASNS = new Set<string>([
  "16509", // Amazon AWS
  "14618", // Amazon AWS
  "15169", // Google Cloud / Crawlers
  "396982", // Google Cloud
  "8075", // Microsoft Azure
  "14061", // DigitalOcean
  "24940", // Hetzner
  "16276", // OVH
  "20473", // Vultr / Choopa
  "63949", // Akamai / Linode
  "31898", // Oracle Cloud
  "45102", // Alibaba Cloud
]);

const SAFE_PARAM_PATTERN = /^[A-Za-z0-9._:@/+ -]{1,200}$/;

export interface FunnelAttribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  ttclid?: string;
  fbc?: string;
  captured_at: number;
}

export type FunnelRouteDecision =
  | { action: "pass" }
  | {
      action: "rewrite";
      destination: string;
      reason: "bot_filtered" | "missing_attribution";
    }
  | {
      action: "redirect";
      destination: string;
      reason: "vip_mobile_direct";
      attribution: FunnelAttribution;
      serializedCookie: string;
    }
  | {
      action: "allow";
      attribution: FunnelAttribution;
      serializedCookie: string;
    };

export interface EvaluateFunnelRouteInput {
  pathname: string;
  searchParams: URLSearchParams;
  userAgent: string | null;
  asNumber?: string | null;
  existingCookieRaw?: string | null;
  strictAttribution?: boolean;
  vipGroupUrl?: string;
  nowMs?: number;
}

export function sanitizeTrackingValue(value: string | null | undefined): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 200) return undefined;
  return SAFE_PARAM_PATTERN.test(trimmed) ? trimmed : undefined;
}

/**
 * Valida estritamente links HTTPS de convite de grupo do WhatsApp para
 * impedir open redirect por variável de ambiente mal configurada.
 */
export function resolveWhatsAppVipGroupUrl(envValue?: string): string {
  const trimmed = envValue?.trim();
  if (!trimmed) return DEFAULT_WHATSAPP_VIP_GROUP_URL;
  try {
    const parsed = new URL(trimmed);
    if (
      parsed.protocol === "https:" &&
      parsed.hostname === "chat.whatsapp.com" &&
      parsed.pathname.length > 1
    ) {
      return parsed.toString();
    }
  } catch {
    // Fallback seguro para o link oficial do Grupo VIP.
  }
  return DEFAULT_WHATSAPP_VIP_GROUP_URL;
}

export function isInAppAdBrowser(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return IN_APP_AD_BROWSER_PATTERN.test(userAgent);
}

export function isMobileUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return MOBILE_UA_PATTERN.test(userAgent) || isInAppAdBrowser(userAgent);
}

export function isAutomatedBotRequest(
  userAgent: string | null,
  asNumber?: string | null,
): boolean {
  const ua = userAgent?.trim() ?? "";
  if (!ua || ua.length < 12) return true;
  if (AUTOMATED_UA_PATTERN.test(ua)) return true;

  const cleanAsn = asNumber?.replace(/^AS/i, "").trim() ?? "";
  if (cleanAsn && DATACENTER_ASNS.has(cleanAsn) && !isInAppAdBrowser(ua)) {
    return true;
  }

  return false;
}

export function parseAttributionCookie(
  raw: string | null | undefined,
): FunnelAttribution | null {
  if (!raw || raw.length > 2048) return null;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") return null;

    const attr: FunnelAttribution = {
      utm_source: sanitizeTrackingValue(
        typeof parsed.utm_source === "string" ? parsed.utm_source : undefined,
      ),
      utm_medium: sanitizeTrackingValue(
        typeof parsed.utm_medium === "string" ? parsed.utm_medium : undefined,
      ),
      utm_campaign: sanitizeTrackingValue(
        typeof parsed.utm_campaign === "string" ? parsed.utm_campaign : undefined,
      ),
      utm_content: sanitizeTrackingValue(
        typeof parsed.utm_content === "string" ? parsed.utm_content : undefined,
      ),
      utm_term: sanitizeTrackingValue(
        typeof parsed.utm_term === "string" ? parsed.utm_term : undefined,
      ),
      fbclid: sanitizeTrackingValue(
        typeof parsed.fbclid === "string" ? parsed.fbclid : undefined,
      ),
      ttclid: sanitizeTrackingValue(
        typeof parsed.ttclid === "string" ? parsed.ttclid : undefined,
      ),
      fbc: sanitizeTrackingValue(typeof parsed.fbc === "string" ? parsed.fbc : undefined),
      captured_at:
        typeof parsed.captured_at === "number" && Number.isFinite(parsed.captured_at)
          ? parsed.captured_at
          : Date.now(),
    };

    return hasQualifiedCampaignAttribution(attr) ? attr : null;
  } catch {
    return null;
  }
}

export function extractAttribution(
  searchParams: URLSearchParams,
  existingCookieRaw?: string | null,
  nowMs = Date.now(),
): FunnelAttribution {
  const previous = parseAttributionCookie(existingCookieRaw);

  const utm_source = sanitizeTrackingValue(searchParams.get("utm_source")) ?? previous?.utm_source;
  const utm_medium = sanitizeTrackingValue(searchParams.get("utm_medium")) ?? previous?.utm_medium;
  const utm_campaign =
    sanitizeTrackingValue(searchParams.get("utm_campaign")) ?? previous?.utm_campaign;
  const utm_content =
    sanitizeTrackingValue(searchParams.get("utm_content")) ?? previous?.utm_content;
  const utm_term = sanitizeTrackingValue(searchParams.get("utm_term")) ?? previous?.utm_term;
  const fbclid = sanitizeTrackingValue(searchParams.get("fbclid")) ?? previous?.fbclid;
  const ttclid = sanitizeTrackingValue(searchParams.get("ttclid")) ?? previous?.ttclid;

  // Formato oficial Meta CAPI para fbc: fb.1.<creation_time_ms>.<fbclid>
  const fbc = fbclid
    ? previous?.fbclid === fbclid && previous.fbc
      ? previous.fbc
      : `fb.1.${nowMs}.${fbclid}`
    : previous?.fbc;

  return {
    ...(utm_source ? { utm_source } : {}),
    ...(utm_medium ? { utm_medium } : {}),
    ...(utm_campaign ? { utm_campaign } : {}),
    ...(utm_content ? { utm_content } : {}),
    ...(utm_term ? { utm_term } : {}),
    ...(fbclid ? { fbclid } : {}),
    ...(ttclid ? { ttclid } : {}),
    ...(fbc ? { fbc } : {}),
    captured_at: previous?.captured_at ?? nowMs,
  };
}

export function hasQualifiedCampaignAttribution(attr: FunnelAttribution): boolean {
  return Boolean(attr.utm_source || attr.fbclid || attr.ttclid);
}

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function isProtectedFunnelPath(pathname: string): boolean {
  return matchesPrefix(pathname, AVALIACAO_PREFIX) || matchesPrefix(pathname, VIP_PREFIX);
}

export function evaluateFunnelRoute(input: EvaluateFunnelRouteInput): FunnelRouteDecision {
  if (!isProtectedFunnelPath(input.pathname)) {
    return { action: "pass" };
  }

  if (isAutomatedBotRequest(input.userAgent, input.asNumber)) {
    return {
      action: "rewrite",
      destination: INSTITUTIONAL_FALLBACK_PATH,
      reason: "bot_filtered",
    };
  }

  const attribution = extractAttribution(
    input.searchParams,
    input.existingCookieRaw,
    input.nowMs,
  );

  const strict = input.strictAttribution ?? true;
  if (strict && !hasQualifiedCampaignAttribution(attribution)) {
    return {
      action: "rewrite",
      destination: INSTITUTIONAL_FALLBACK_PATH,
      reason: "missing_attribution",
    };
  }

  const serializedCookie = JSON.stringify(attribution);

  // Rota direta /vip: tráfego mobile atribuído vai direto ao Grupo VIP em 1 clique.
  if (matchesPrefix(input.pathname, VIP_PREFIX) && isMobileUserAgent(input.userAgent)) {
    return {
      action: "redirect",
      destination: resolveWhatsAppVipGroupUrl(input.vipGroupUrl),
      reason: "vip_mobile_direct",
      attribution,
      serializedCookie,
    };
  }

  return {
    action: "allow",
    attribution,
    serializedCookie,
  };
}
