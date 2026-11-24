import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import {
  buildMetaCapiPayload,
  buildTikTokEventsPayload,
  dispatchFunnelConversions,
  normalizeBrazilianPhoneForHash,
  sha256Hex,
} from "../lib/funnel/conversion-apis.ts";

const BASE_INPUT = {
  eventId: "evt-12345",
  eventTimeUnix: 1764000000,
  pageUrl: "https://pharmil-landingpage.vercel.app/avaliacao?utm_source=meta",
  firstName: "Marina Silva",
  phoneDigits: "(48) 99115-3151",
  clientIp: "200.100.50.25",
  userAgent: "Mozilla/5.0 Mobile",
  fbc: "fb.1.1764000000000.IwAR123",
  fbp: "fb.1.1764000000000.987654321",
  ttclid: "ttclid_abc",
};

const ENV_KEYS = [
  "META_PIXEL_ID",
  "META_CAPI_ACCESS_TOKEN",
  "META_TEST_EVENT_CODE",
  "TIKTOK_PIXEL_CODE",
  "TIKTOK_ACCESS_TOKEN",
  "TIKTOK_TEST_EVENT_CODE",
];

const originalEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (originalEnv[key] === undefined) delete process.env[key];
    else process.env[key] = originalEnv[key];
  }
});

describe("server-side conversion APIs (Meta CAPI + TikTok Events API)", () => {
  it("normaliza telefone brasileiro para E.164 antes do hash SHA-256", async () => {
    assert.equal(normalizeBrazilianPhoneForHash("(48) 99115-3151"), "5548991153151");
    assert.equal(normalizeBrazilianPhoneForHash("5548991153151"), "5548991153151");
    assert.equal(normalizeBrazilianPhoneForHash("123"), null);

    const hash = await sha256Hex("5548991153151");
    assert.match(hash, /^[0-9a-f]{64}$/);
  });

  it("constroi payload Meta CAPI v21 com Lead e InitiateCheckout e PII hasheada", async () => {
    const payload = await buildMetaCapiPayload(BASE_INPUT, "TEST123");
    const events = payload.data;

    assert.equal(events.length, 2);
    assert.equal(events[0].event_name, "Lead");
    assert.equal(events[0].event_id, "evt-12345:lead");
    assert.equal(events[1].event_name, "InitiateCheckout");
    assert.equal(events[1].event_id, "evt-12345:ic");
    assert.equal(payload.test_event_code, "TEST123");

    const userData = events[0].user_data;
    assert.equal(userData.fbc, BASE_INPUT.fbc);
    assert.deepEqual(userData.ph, [await sha256Hex("5548991153151")]);
    assert.deepEqual(userData.fn, [await sha256Hex("marina")]);
  });

  it("constroi payload TikTok Events API v1.3 com ttclid e telefone hasheado", async () => {
    const payload = await buildTikTokEventsPayload(BASE_INPUT, "TTPIXEL99", "TESTTT");
    const events = payload.data;

    assert.equal(payload.event_source, "web");
    assert.equal(payload.event_source_id, "TTPIXEL99");
    assert.equal(payload.test_event_code, "TESTTT");
    assert.deepEqual(
      events.map((e) => e.event),
      ["SubmitForm", "InitiateCheckout"],
    );
    assert.equal(events[0].user.ttclid, "ttclid_abc");
    assert.equal(events[0].user.phone, await sha256Hex("5548991153151"));
  });

  it("nao falha nem dispara HTTP quando credenciais nao estao configuradas", async () => {
    delete process.env.META_PIXEL_ID;
    delete process.env.META_CAPI_ACCESS_TOKEN;
    delete process.env.TIKTOK_PIXEL_CODE;
    delete process.env.TIKTOK_ACCESS_TOKEN;

    let calls = 0;
    const fakeFetch = async () => {
      calls += 1;
      return new Response("{}", { status: 200 });
    };

    const res = await dispatchFunnelConversions(BASE_INPUT, fakeFetch);
    assert.equal(calls, 0);
    assert.deepEqual(res.meta, {
      channel: "meta_capi",
      dispatched: false,
      reason: "not_configured",
    });
    assert.deepEqual(res.tiktok, {
      channel: "tiktok_events_api",
      dispatched: false,
      reason: "not_configured",
    });
  });

  it("envia para Meta e TikTok em paralelo quando configurados", async () => {
    process.env.META_PIXEL_ID = "123456";
    process.env.META_CAPI_ACCESS_TOKEN = "meta_tok";
    process.env.TIKTOK_PIXEL_CODE = "TT123";
    process.env.TIKTOK_ACCESS_TOKEN = "tt_tok";

    const urls = [];
    const fakeFetch = async (url) => {
      urls.push(String(url));
      return new Response("{}", { status: 200 });
    };

    const res = await dispatchFunnelConversions(BASE_INPUT, fakeFetch);
    assert.equal(urls.length, 2);
    assert.equal(res.meta.dispatched, true);
    assert.equal(res.tiktok.dispatched, true);
  });
});
