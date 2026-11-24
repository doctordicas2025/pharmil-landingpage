"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies, headers } from "next/headers";

import { dispatchFunnelConversions } from "@/lib/funnel/conversion-apis";
import {
  buildDirectWhatsAppUrl,
  buildQuizDiagnosticSummary,
  buildWhatsAppSummaryUrl,
  labelForQuizOption,
  priorityTagForMomento,
  quizSubmissionSchema,
  resolveVipGroupInviteUrl,
} from "@/lib/funnel/quiz-config";
import {
  ATTRIBUTION_COOKIE_NAME,
  parseAttributionCookie,
} from "@/lib/funnel/traffic-routing";
import { actionClient } from "@/lib/safe-action";
import { getSiteUrl } from "@/lib/site-config";

export interface QuizSubmissionResult {
  eventId: string;
  vipGroupUrl: string;
  whatsappUrl: string;
  directWhatsappUrl: string;
  summary: string;
}

export type QuizActionResponse =
  | { success: true; data: QuizSubmissionResult }
  | { success: false; error: string };

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_PER_IP = 15;
const ipSubmissionBuckets = new Map<string, number[]>();

function checkInMemoryRateLimit(ipKey: string, nowMs = Date.now()): boolean {
  const recent = (ipSubmissionBuckets.get(ipKey) ?? []).filter(
    (timestamp) => nowMs - timestamp < RATE_LIMIT_WINDOW_MS,
  );
  if (recent.length >= RATE_LIMIT_MAX_PER_IP) {
    ipSubmissionBuckets.set(ipKey, recent);
    return false;
  }
  recent.push(nowMs);
  ipSubmissionBuckets.set(ipKey, recent);

  // Evita crescimento ilimitado em instâncias longas.
  if (ipSubmissionBuckets.size > 1000) {
    for (const [key, timestamps] of ipSubmissionBuckets) {
      if (timestamps.every((ts) => nowMs - ts >= RATE_LIMIT_WINDOW_MS)) {
        ipSubmissionBuckets.delete(key);
      }
    }
  }
  return true;
}

function resolveClientIp(reqHeaders: Headers): string | null {
  const forwarded = reqHeaders.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return reqHeaders.get("x-real-ip")?.trim() || null;
}

function createServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Persiste o diagnóstico do funil `/avaliacao` no Supabase (`leads` e, quando
 * disponível, `funnel_quiz_submissions`), dispara conversões server-side
 * (Meta CAPI + TikTok Events API) e devolve o link do Grupo VIP + fallback
 * para atendimento direto no WhatsApp oficial.
 */
export const submitQuizAvaliacao = actionClient
  .inputSchema(quizSubmissionSchema)
  .action(async ({ parsedInput }): Promise<QuizActionResponse> => {
    const [cookieStore, reqHeaders] = await Promise.all([cookies(), headers()]);
    const clientIp = resolveClientIp(reqHeaders);

    if (!checkInMemoryRateLimit(clientIp ?? "unknown")) {
      return {
        success: false,
        error: "Muitas tentativas seguidas. Aguarde alguns minutos e tente novamente.",
      };
    }

    const cookieAttr = parseAttributionCookie(
      cookieStore.get(ATTRIBUTION_COOKIE_NAME)?.value,
    );

    const utmSource = parsedInput.utm_source || cookieAttr?.utm_source || null;
    const utmMedium = parsedInput.utm_medium || cookieAttr?.utm_medium || null;
    const utmCampaign = parsedInput.utm_campaign || cookieAttr?.utm_campaign || null;
    const utmContent = parsedInput.utm_content || cookieAttr?.utm_content || null;
    const utmTerm = parsedInput.utm_term || cookieAttr?.utm_term || null;
    const fbclid = parsedInput.fbclid || cookieAttr?.fbclid || null;
    const ttclid = parsedInput.ttclid || cookieAttr?.ttclid || null;
    const fbc = cookieStore.get("_fbc")?.value || cookieAttr?.fbc || null;
    const fbp = cookieStore.get("_fbp")?.value || null;

    const eventId = crypto.randomUUID();
    const userAgent = reqHeaders.get("user-agent");
    const defaultAvaliacaoUrl = new URL("/avaliacao", getSiteUrl()).toString();
    const pageUrl = parsedInput.pageUrl || reqHeaders.get("referer") || defaultAvaliacaoUrl;

    const answers = {
      objetivo: parsedInput.objetivo,
      experiencia: parsedInput.experiencia,
      desafio: parsedInput.desafio,
      momento: parsedInput.momento,
    };

    const labels = [
      "quiz-avaliacao",
      priorityTagForMomento(parsedInput.momento),
      ...(utmSource ? [`origem-${utmSource.toLowerCase().slice(0, 32)}`] : []),
    ];

    const conversionResult = await dispatchFunnelConversions({
      eventId,
      eventTimeUnix: Math.floor(Date.now() / 1000),
      pageUrl,
      firstName: parsedInput.firstName,
      phoneDigits: parsedInput.phone,
      clientIp,
      userAgent,
      fbc,
      fbp,
      ttclid,
      contentName: "quiz_avaliacao_pharmil",
    });

    const leadMetadata = {
      funnel: "avaliacao_vip_v1",
      destination: "whatsapp_vip_group",
      event_id: eventId,
      answers,
      attribution: {
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_content: utmContent,
        utm_term: utmTerm,
        fbclid,
        ttclid,
        fbc,
        fbp,
      },
      conversions: {
        meta_capi: conversionResult.meta.dispatched
          ? "sent"
          : (conversionResult.meta.reason ?? "skipped"),
        tiktok_events_api: conversionResult.tiktok.dispatched
          ? "sent"
          : (conversionResult.tiktok.reason ?? "skipped"),
      },
    };

    const supabaseServer = createServerSupabase();
    if (supabaseServer) {
      let leadId: string | null = null;
      const objetivoResumo = [
        labelForQuizOption("objetivo", parsedInput.objetivo),
        labelForQuizOption("momento", parsedInput.momento),
        labelForQuizOption("desafio", parsedInput.desafio),
      ].join(" | ");
      const origemResumo = utmCampaign || utmSource || "quiz_avaliacao";

      const { data: lpLeadRow, error: lpLeadError } = await supabaseServer
        .from("leads")
        .insert([
          {
            nome: parsedInput.firstName,
            telefone: parsedInput.phone,
            objetivo: objetivoResumo,
            influenciadora: origemResumo,
          },
        ])
        .select("id")
        .maybeSingle();

      if (!lpLeadError) {
        leadId = typeof lpLeadRow?.id === "string" ? lpLeadRow.id : null;
      } else if (lpLeadError.code === "42703" || lpLeadError.code === "PGRST204") {
        // Fallback automático caso a instância Supabase use o schema estruturado do painel.
        const { data: dashLeadRow, error: dashLeadError } = await supabaseServer
          .from("leads")
          .insert({
            name: parsedInput.firstName,
            phone: parsedInput.phone,
            email: null,
            source: "quiz_avaliacao",
            labels,
            metadata: leadMetadata,
          })
          .select("id")
          .maybeSingle();

        if (!dashLeadError) {
          leadId = typeof dashLeadRow?.id === "string" ? dashLeadRow.id : null;
        } else {
          console.error("[quiz-avaliacao] lead_insert_fallback_failed", {
            code: dashLeadError.code,
          });
        }
      } else {
        console.error("[quiz-avaliacao] lead_insert_failed", { code: lpLeadError.code });
      }

      // Tabela analítica dedicada: gravação best-effort quando a migration estiver aplicada.
      const { error: submissionError } = await supabaseServer
        .from("funnel_quiz_submissions")
        .insert({
          event_id: eventId,
          lead_id: leadId,
          first_name: parsedInput.firstName,
          phone_normalized: parsedInput.phone,
          answers,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          utm_content: utmContent,
          utm_term: utmTerm,
          fbclid,
          ttclid,
          fbc,
          fbp,
          meta_capi_status: conversionResult.meta.dispatched
            ? "sent"
            : (conversionResult.meta.reason ?? "skipped"),
          tiktok_capi_status: conversionResult.tiktok.dispatched
            ? "sent"
            : (conversionResult.tiktok.reason ?? "skipped"),
        });

      if (
        submissionError &&
        submissionError.code !== "42P01" &&
        submissionError.code !== "PGRST205"
      ) {
        console.warn("[quiz-avaliacao] submission_insert_skipped", {
          code: submissionError.code,
        });
      }
    } else {
      console.warn("[quiz-avaliacao] supabase_not_configured");
    }

    const summary = buildQuizDiagnosticSummary(parsedInput);
    const vipGroupUrl = resolveVipGroupInviteUrl(
      process.env.NEXT_PUBLIC_WHATSAPP_VIP_GROUP_URL,
    );
    const whatsappUrl = buildWhatsAppSummaryUrl(
      parsedInput,
      process.env.NEXT_PUBLIC_WHATSAPP_OFFICIAL_NUMBER,
    );
    const directWhatsappUrl = buildDirectWhatsAppUrl(
      process.env.NEXT_PUBLIC_WHATSAPP_OFFICIAL_NUMBER,
    );

    return {
      success: true,
      data: {
        eventId,
        vipGroupUrl,
        whatsappUrl,
        directWhatsappUrl,
        summary,
      },
    };
  });
