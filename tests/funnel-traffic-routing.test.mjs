import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  DEFAULT_WHATSAPP_VIP_GROUP_URL,
  evaluateFunnelRoute,
  extractAttribution,
  isAutomatedBotRequest,
  isInAppAdBrowser,
  isMobileUserAgent,
  resolveWhatsAppVipGroupUrl,
  sanitizeTrackingValue,
} from "../lib/funnel/traffic-routing.ts";

const REAL_IOS_CHROME =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/128.0.0.0 Mobile/15E148 Safari/604.1";
const REAL_DESKTOP_CHROME =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const META_IN_APP =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21F79 [FBAN/FBIOS;FBAV/470.0.0.0;FBBV/12345]";
const TIKTOK_IN_APP =
  "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36 BytedanceWebview/d8a21c6 TikTok/35.4.1";

describe("funnel traffic routing & bot filtering (/avaliacao e /vip)", () => {
  it("nao interfere em rotas fora de /avaliacao e /vip", () => {
    const decision = evaluateFunnelRoute({
      pathname: "/",
      searchParams: new URLSearchParams(),
      userAgent: "curl/8.4.0",
    });
    assert.deepEqual(decision, { action: "pass" });
  });

  it("filtra crawlers, preview bots e automacao com rewrite interno para /institucional", () => {
    const botAgents = [
      "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "Mozilla/5.0 (compatible; Bytespider; spider-feedback@bytedance.com)",
      "Mozilla/5.0 (X11; Linux x86_64) HeadlessChrome/128.0.0.0 Safari/537.36",
      "curl/8.7.1",
      "python-requests/2.32.3",
      "",
    ];

    for (const pathname of ["/avaliacao", "/vip"]) {
      for (const ua of botAgents) {
        assert.equal(isAutomatedBotRequest(ua), true);
        const decision = evaluateFunnelRoute({
          pathname,
          searchParams: new URLSearchParams("utm_source=meta&fbclid=IwAR123"),
          userAgent: ua,
        });
        assert.deepEqual(decision, {
          action: "rewrite",
          destination: "/institucional",
          reason: "bot_filtered",
        });
      }
    }
  });

  it("filtra data center ASN para UA comum mas preserva in-app browser legitimo", () => {
    assert.equal(isAutomatedBotRequest(REAL_IOS_CHROME, "16509"), true);
    assert.equal(isInAppAdBrowser(META_IN_APP), true);
    assert.equal(isInAppAdBrowser(TIKTOK_IN_APP), true);
    assert.equal(isAutomatedBotRequest(META_IN_APP, "16509"), false);
    assert.equal(isAutomatedBotRequest(TIKTOK_IN_APP, "15169"), false);
  });

  it("reescreve visitante humano sem atribuicao em /avaliacao e /vip para /institucional", () => {
    for (const pathname of ["/avaliacao", "/vip"]) {
      const decision = evaluateFunnelRoute({
        pathname,
        searchParams: new URLSearchParams(),
        userAgent: REAL_IOS_CHROME,
      });
      assert.deepEqual(decision, {
        action: "rewrite",
        destination: "/institucional",
        reason: "missing_attribution",
      });
    }
  });

  it("libera visitante de campanha Meta em /avaliacao com fbclid e gera fbc oficial", () => {
    const now = 1764000000000;
    const decision = evaluateFunnelRoute({
      pathname: "/avaliacao",
      searchParams: new URLSearchParams(
        "utm_source=meta&utm_campaign=PHM_01&fbclid=IwAR_abc123",
      ),
      userAgent: META_IN_APP,
      nowMs: now,
    });

    assert.equal(decision.action, "allow");
    if (decision.action === "allow") {
      assert.equal(decision.attribution.utm_source, "meta");
      assert.equal(decision.attribution.fbclid, "IwAR_abc123");
      assert.equal(decision.attribution.fbc, `fb.1.${now}.IwAR_abc123`);
    }
  });

  it("redireciona trafego mobile atribuido em /vip direto para o Grupo VIP em 1 clique", () => {
    assert.equal(isMobileUserAgent(REAL_IOS_CHROME), true);
    assert.equal(isMobileUserAgent(META_IN_APP), true);
    assert.equal(isMobileUserAgent(REAL_DESKTOP_CHROME), false);

    const decision = evaluateFunnelRoute({
      pathname: "/vip",
      searchParams: new URLSearchParams("utm_source=meta&fbclid=IwAR_vip1"),
      userAgent: META_IN_APP,
      nowMs: 1764000002000,
    });

    assert.equal(decision.action, "redirect");
    if (decision.action === "redirect") {
      assert.equal(decision.reason, "vip_mobile_direct");
      assert.equal(decision.destination, DEFAULT_WHATSAPP_VIP_GROUP_URL);
      assert.equal(decision.attribution.utm_source, "meta");
      assert.equal(decision.attribution.fbclid, "IwAR_vip1");
    }
  });

  it("permite pagina /vip para desktop atribuido sem redirecionar automaticamente", () => {
    const decision = evaluateFunnelRoute({
      pathname: "/vip",
      searchParams: new URLSearchParams("utm_source=tiktok&ttclid=tt_desktop_1"),
      userAgent: REAL_DESKTOP_CHROME,
    });

    assert.equal(decision.action, "allow");
    if (decision.action === "allow") {
      assert.equal(decision.attribution.ttclid, "tt_desktop_1");
    }
  });

  it("preserva cookie de atribuicao em recarregamento de /avaliacao", () => {
    const first = evaluateFunnelRoute({
      pathname: "/avaliacao",
      searchParams: new URLSearchParams("ttclid=E_C_P_tiktok_999&utm_source=tiktok"),
      userAgent: TIKTOK_IN_APP,
      nowMs: 1764000001000,
    });

    assert.equal(first.action, "allow");
    if (first.action !== "allow") return;

    const reload = evaluateFunnelRoute({
      pathname: "/avaliacao",
      searchParams: new URLSearchParams(),
      userAgent: TIKTOK_IN_APP,
      existingCookieRaw: first.serializedCookie,
    });

    assert.equal(reload.action, "allow");
    if (reload.action === "allow") {
      assert.equal(reload.attribution.ttclid, "E_C_P_tiktok_999");
      assert.equal(reload.attribution.utm_source, "tiktok");
    }
  });

  it("sanitiza parametros maliciosos e bloqueia open redirect no link do Grupo VIP", () => {
    assert.equal(sanitizeTrackingValue("<script>alert(1)</script>"), undefined);
    assert.equal(sanitizeTrackingValue('meta"; DROP TABLE leads;--'), undefined);
    assert.equal(sanitizeTrackingValue("PHM_012_G1_C1_F9x16"), "PHM_012_G1_C1_F9x16");

    const attr = extractAttribution(new URLSearchParams("utm_source=<script>"));
    assert.equal(attr.utm_source, undefined);

    assert.equal(
      resolveWhatsAppVipGroupUrl("https://evil.example.com/phishing"),
      DEFAULT_WHATSAPP_VIP_GROUP_URL,
    );
    assert.equal(
      resolveWhatsAppVipGroupUrl("http://chat.whatsapp.com/insecure"),
      DEFAULT_WHATSAPP_VIP_GROUP_URL,
    );
    assert.equal(
      resolveWhatsAppVipGroupUrl("https://chat.whatsapp.com/AbCdEf123456"),
      "https://chat.whatsapp.com/AbCdEf123456",
    );
  });
});
