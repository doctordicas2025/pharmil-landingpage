// =============================================================
// Pharmil — Disparo Server-Side de Conversões (Meta CAPI + TikTok Events API)
//
// Envia eventos Lead / SubmitForm e InitiateCheckout diretamente do servidor
// com hash SHA-256 de PII, event_id determinístico e timeout curto para
// nunca travar a transição do lead ao Grupo VIP no WhatsApp.
// =============================================================

export interface ConversionDispatchInput {
  eventId: string;
  eventTimeUnix: number;
  pageUrl: string;
  firstName?: string | null;
  phoneDigits?: string | null;
  clientIp?: string | null;
  userAgent?: string | null;
  fbc?: string | null;
  fbp?: string | null;
  ttclid?: string | null;
  contentName?: string;
}

export interface ChannelDispatchResult {
  channel: "meta_capi" | "tiktok_events_api";
  dispatched: boolean;
  statusCode?: number;
  reason?: string;
}

const REQUEST_TIMEOUT_MS = 4000;

export function normalizeBrazilianPhoneForHash(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) return null;
  return digits.startsWith("55") && digits.length >= 12 ? digits : `55${digits}`;
}

export async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value.trim().toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function buildMetaCapiPayload(
  input: ConversionDispatchInput,
  testEventCode?: string | null,
): Promise<Record<string, unknown>> {
  const normalizedPhone = normalizeBrazilianPhoneForHash(input.phoneDigits);
  const [phHash, fnHash] = await Promise.all([
    normalizedPhone ? sha256Hex(normalizedPhone) : Promise.resolve(null),
    input.firstName?.trim()
      ? sha256Hex(input.firstName.trim().split(/\s+/)[0] ?? "")
      : Promise.resolve(null),
  ]);

  const userData: Record<string, unknown> = {
    ...(phHash ? { ph: [phHash] } : {}),
    ...(fnHash ? { fn: [fnHash] } : {}),
    ...(input.clientIp ? { client_ip_address: input.clientIp } : {}),
    ...(input.userAgent ? { client_user_agent: input.userAgent } : {}),
    ...(input.fbc ? { fbc: input.fbc } : {}),
    ...(input.fbp ? { fbp: input.fbp } : {}),
  };

  const baseEvent = {
    event_time: input.eventTimeUnix,
    action_source: "website",
    event_source_url: input.pageUrl,
    user_data: userData,
    custom_data: {
      content_name: input.contentName ?? "quiz_avaliacao_pharmil",
      content_category: "avaliacao_rotina",
    },
  };

  return {
    data: [
      { ...baseEvent, event_name: "Lead", event_id: `${input.eventId}:lead` },
      { ...baseEvent, event_name: "InitiateCheckout", event_id: `${input.eventId}:ic` },
    ],
    ...(testEventCode ? { test_event_code: testEventCode } : {}),
  };
}

export async function buildTikTokEventsPayload(
  input: ConversionDispatchInput,
  pixelCode: string,
  testEventCode?: string | null,
): Promise<Record<string, unknown>> {
  const normalizedPhone = normalizeBrazilianPhoneForHash(input.phoneDigits);
  const phoneHash = normalizedPhone ? await sha256Hex(normalizedPhone) : null;

  const user: Record<string, unknown> = {
    ...(input.ttclid ? { ttclid: input.ttclid } : {}),
    ...(phoneHash ? { phone: phoneHash } : {}),
    ...(input.clientIp ? { ip: input.clientIp } : {}),
    ...(input.userAgent ? { user_agent: input.userAgent } : {}),
  };

  const common = {
    event_time: input.eventTimeUnix,
    user,
    page: { url: input.pageUrl },
    properties: {
      content_type: "product",
      content_name: input.contentName ?? "quiz_avaliacao_pharmil",
    },
  };

  return {
    event_source: "web",
    event_source_id: pixelCode,
    ...(testEventCode ? { test_event_code: testEventCode } : {}),
    data: [
      { ...common, event: "SubmitForm", event_id: `${input.eventId}:lead` },
      { ...common, event: "InitiateCheckout", event_id: `${input.eventId}:ic` },
    ],
  };
}

export async function dispatchMetaCapi(
  input: ConversionDispatchInput,
  fetchImpl: typeof fetch = fetch,
): Promise<ChannelDispatchResult> {
  const pixelId = process.env.META_PIXEL_ID?.trim();
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN?.trim();
  if (!pixelId || !accessToken) {
    return { channel: "meta_capi", dispatched: false, reason: "not_configured" };
  }

  try {
    const payload = await buildMetaCapiPayload(input, process.env.META_TEST_EVENT_CODE?.trim());
    const url = `https://graph.facebook.com/v21.0/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(accessToken)}`;
    const response = await fetchImpl(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      return {
        channel: "meta_capi",
        dispatched: false,
        statusCode: response.status,
        reason: `http_${response.status}`,
      };
    }

    return { channel: "meta_capi", dispatched: true, statusCode: response.status };
  } catch (error) {
    return {
      channel: "meta_capi",
      dispatched: false,
      reason: error instanceof Error ? error.name : "network_error",
    };
  }
}

export async function dispatchTikTokEvents(
  input: ConversionDispatchInput,
  fetchImpl: typeof fetch = fetch,
): Promise<ChannelDispatchResult> {
  const pixelCode = process.env.TIKTOK_PIXEL_CODE?.trim();
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN?.trim();
  if (!pixelCode || !accessToken) {
    return { channel: "tiktok_events_api", dispatched: false, reason: "not_configured" };
  }

  try {
    const payload = await buildTikTokEventsPayload(
      input,
      pixelCode,
      process.env.TIKTOK_TEST_EVENT_CODE?.trim(),
    );
    const response = await fetchImpl(
      "https://business-api.tiktok.com/open_api/v1.3/event/track/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Token": accessToken,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      },
    );

    if (!response.ok) {
      return {
        channel: "tiktok_events_api",
        dispatched: false,
        statusCode: response.status,
        reason: `http_${response.status}`,
      };
    }

    return { channel: "tiktok_events_api", dispatched: true, statusCode: response.status };
  } catch (error) {
    return {
      channel: "tiktok_events_api",
      dispatched: false,
      reason: error instanceof Error ? error.name : "network_error",
    };
  }
}

export async function dispatchFunnelConversions(
  input: ConversionDispatchInput,
  fetchImpl: typeof fetch = fetch,
): Promise<{
  meta: ChannelDispatchResult;
  tiktok: ChannelDispatchResult;
}> {
  const [meta, tiktok] = await Promise.all([
    dispatchMetaCapi(input, fetchImpl),
    dispatchTikTokEvents(input, fetchImpl),
  ]);
  return { meta, tiktok };
}
