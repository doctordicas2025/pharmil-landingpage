// =============================================================
// Pharmil Landing Page — Next.js 16 Proxy (Funnel Traffic Routing)
//
// Governa as rotas /avaliacao e /vip:
// - Tráfego sem atribuição ou bot -> rewrite interno para /institucional
//   (mantém a URL original na barra de endereços, sem redirect 307).
// - Tráfego mobile atribuído em /vip -> redirect direto ao Grupo VIP.
// - Tráfego atribuído em /avaliacao (e desktop em /vip) -> persiste
//   cookie first-party de atribuição por 7 dias e libera a página.
// =============================================================

import { NextResponse, type NextRequest } from "next/server";

import {
  ATTRIBUTION_COOKIE_MAX_AGE_SECONDS,
  ATTRIBUTION_COOKIE_NAME,
  evaluateFunnelRoute,
} from "@/lib/funnel/traffic-routing";

function applyAttributionCookie(response: NextResponse, serializedCookie: string) {
  response.cookies.set(ATTRIBUTION_COOKIE_NAME, serializedCookie, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ATTRIBUTION_COOKIE_MAX_AGE_SECONDS,
  });
}

export function proxy(request: NextRequest) {
  const strictAttribution = process.env.FUNNEL_STRICT_ROUTING !== "0";

  const decision = evaluateFunnelRoute({
    pathname: request.nextUrl.pathname,
    searchParams: request.nextUrl.searchParams,
    userAgent: request.headers.get("user-agent"),
    asNumber: request.headers.get("x-vercel-ip-as-number"),
    existingCookieRaw: request.cookies.get(ATTRIBUTION_COOKIE_NAME)?.value,
    strictAttribution,
    vipGroupUrl: process.env.NEXT_PUBLIC_WHATSAPP_VIP_GROUP_URL,
  });

  if (decision.action === "rewrite") {
    const url = request.nextUrl.clone();
    url.pathname = decision.destination;
    url.search = "";
    const response = NextResponse.rewrite(url);
    response.headers.set("cache-control", "no-store");
    response.headers.set("x-pharmil-route-reason", decision.reason);
    return response;
  }

  if (decision.action === "redirect") {
    const response = NextResponse.redirect(decision.destination, 307);
    response.headers.set("cache-control", "no-store");
    response.headers.set("x-pharmil-route-reason", decision.reason);
    applyAttributionCookie(response, decision.serializedCookie);
    return response;
  }

  const response = NextResponse.next();

  if (decision.action === "allow") {
    applyAttributionCookie(response, decision.serializedCookie);
  }

  return response;
}

export const config = {
  matcher: ["/avaliacao", "/avaliacao/:path*", "/vip", "/vip/:path*"],
};
