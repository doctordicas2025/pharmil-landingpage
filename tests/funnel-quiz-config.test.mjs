import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildDirectWhatsAppUrl,
  buildQuizDiagnosticSummary,
  buildWhatsAppSummaryUrl,
  DEFAULT_WHATSAPP_NUMBER,
  DEFAULT_WHATSAPP_VIP_GROUP_URL,
  priorityTagForMomento,
  QUIZ_STEPS,
  quizSubmissionSchema,
  resolveOfficialWhatsAppNumber,
  resolveVipGroupInviteUrl,
} from "../lib/funnel/quiz-config.ts";

describe("quiz de avaliacao config e validacao", () => {
  it("define exatamente 4 perguntas de diagnostico", () => {
    assert.equal(QUIZ_STEPS.length, 4);
    assert.deepEqual(
      QUIZ_STEPS.map((s) => s.id),
      ["objetivo", "experiencia", "desafio", "momento"],
    );
  });

  it("normaliza telefone e valida payload completo", () => {
    const parsed = quizSubmissionSchema.safeParse({
      firstName: "  Marina  ",
      phone: "(48) 99115-3151",
      objetivo: "controle_medidas",
      experiencia: "primeira_vez",
      desafio: "procedencia_seguranca",
      momento: "esta_semana",
      utm_source: "meta",
      fbclid: "IwAR123",
    });

    assert.equal(parsed.success, true);
    if (parsed.success) {
      assert.equal(parsed.data.firstName, "Marina");
      assert.equal(parsed.data.phone, "48991153151");
    }
  });

  it("recusa telefone curto ou opcao fora do catalogo", () => {
    const badPhone = quizSubmissionSchema.safeParse({
      firstName: "Marina",
      phone: "12345",
      objetivo: "controle_medidas",
      experiencia: "primeira_vez",
      desafio: "procedencia_seguranca",
      momento: "esta_semana",
    });
    assert.equal(badPhone.success, false);

    const badOption = quizSubmissionSchema.safeParse({
      firstName: "Marina",
      phone: "48991153151",
      objetivo: "invalido",
      experiencia: "primeira_vez",
      desafio: "procedencia_seguranca",
      momento: "esta_semana",
    });
    assert.equal(badOption.success, false);
  });

  it("aponta destino principal para o Grupo VIP oficial e mantem atendimento direto (48) 99115-3151", () => {
    assert.equal(
      DEFAULT_WHATSAPP_VIP_GROUP_URL,
      "https://chat.whatsapp.com/JcIISmSCGo28QDWYeQtmDX?s=cl&p=i&iam=2",
    );
    assert.equal(
      resolveVipGroupInviteUrl(undefined),
      "https://chat.whatsapp.com/JcIISmSCGo28QDWYeQtmDX?s=cl&p=i&iam=2",
    );
    assert.equal(
      resolveVipGroupInviteUrl("https://site-invalido.com/x"),
      DEFAULT_WHATSAPP_VIP_GROUP_URL,
    );
    assert.equal(buildDirectWhatsAppUrl(), "https://wa.me/5548991153151");

    const input = {
      firstName: "Marina",
      objetivo: "controle_medidas",
      experiencia: "primeira_vez",
      desafio: "procedencia_seguranca",
      momento: "esta_semana",
    };

    const summary = buildQuizDiagnosticSummary(input);
    assert.match(summary, /Marina/);
    assert.match(summary, /Controle de medidas e saciedade/);
    assert.match(summary, /Ainda esta semana/);

    const url = buildWhatsAppSummaryUrl(input);
    assert.equal(url.startsWith(`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=`), true);
    assert.equal(resolveOfficialWhatsAppNumber("invalido"), DEFAULT_WHATSAPP_NUMBER);
    assert.equal(priorityTagForMomento("esta_semana"), "prioridade-alta");
  });
});
