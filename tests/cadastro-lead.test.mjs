import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it, mock } from "node:test";

import {
  MENSAGEM_FALHA_CADASTRO,
  esquemaDoCadastro,
  registrarLeadDoCadastro,
} from "../lib/cadastro-lead.ts";

// Tudo aqui é sintético: o Supabase é simulado no fetch e nenhum teste sai
// da máquina. O formato das respostas segue o PostgREST.
const URL_FALSA = "https://projeto-de-teste.supabase.co";
const CHAVE_DE_SERVICO_FALSA = "chave-de-servico-somente-teste";
const CHAVE_ANONIMA_FALSA = "chave-anonima-somente-teste";

const VISITANTE = {
  nome: "Visitante Sintética",
  telefone: "(11) 98765-4321",
  objetivo: "Consultar disponibilidade",
};

const ENV_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];
const envOriginal = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]));
const fetchOriginal = globalThis.fetch;

let requisicoes;
let respostas;
let logs;

function responderJson(status, corpo) {
  return new Response(corpo === undefined ? null : JSON.stringify(corpo), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/** Simula o PostgREST: `respostas.GET/POST/PATCH` decidem o que cada verbo devolve. */
function simularSupabase() {
  globalThis.fetch = async (entrada, init = {}) => {
    const url = new URL(typeof entrada === "string" ? entrada : entrada.url ?? String(entrada));
    const metodo = (init.method ?? "GET").toUpperCase();
    const cabecalhos = new Headers(init.headers);
    requisicoes.push({
      metodo,
      url,
      cabecalhos,
      corpo: init.body ? JSON.parse(init.body) : undefined,
    });
    const resposta = respostas[metodo];
    if (!resposta) throw new Error(`requisição inesperada: ${metodo} ${url.pathname}`);
    return resposta();
  };
}

function capturarLogs() {
  for (const nivel of ["log", "info", "warn", "error", "debug"]) {
    mock.method(console, nivel, (...args) => {
      logs.push({ nivel, texto: JSON.stringify(args) });
    });
  }
}

async function registrar(bruto) {
  return registrarLeadDoCadastro(esquemaDoCadastro.parse(bruto));
}

const deUmVerbo = (metodo) => requisicoes.filter((r) => r.metodo === metodo);

beforeEach(() => {
  requisicoes = [];
  logs = [];
  respostas = {
    GET: () => responderJson(200, []),
    POST: () => new Response(null, { status: 201 }),
    PATCH: () => new Response(null, { status: 204 }),
  };
  process.env.NEXT_PUBLIC_SUPABASE_URL = URL_FALSA;
  process.env.SUPABASE_SERVICE_ROLE_KEY = CHAVE_DE_SERVICO_FALSA;
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = CHAVE_ANONIMA_FALSA;
  simularSupabase();
  capturarLogs();
});

afterEach(() => {
  globalThis.fetch = fetchOriginal;
  mock.restoreAll();
  for (const k of ENV_KEYS) {
    if (envOriginal[k] === undefined) delete process.env[k];
    else process.env[k] = envOriginal[k];
  }
});

describe("telefone do cadastro", () => {
  it("guarda só dígitos com 55 na frente quando vem DDD + número", () => {
    assert.equal(esquemaDoCadastro.parse(VISITANTE).telefone, "5511987654321");
    assert.equal(
      esquemaDoCadastro.parse({ ...VISITANTE, telefone: "1133334444" }).telefone,
      "551133334444",
    );
  });

  it("não repete o 55 de quem já digitou o código do país", () => {
    for (const telefone of ["+55 (11) 98765-4321", "55 11 98765 4321", "555511987654321"]) {
      assert.equal(esquemaDoCadastro.parse({ ...VISITANTE, telefone }).telefone, "5511987654321");
    }
  });

  it("aceita o DDD 55 do Rio Grande do Sul sem confundir com o código do país", () => {
    assert.equal(
      esquemaDoCadastro.parse({ ...VISITANTE, telefone: "(55) 98765-4321" }).telefone,
      "5555987654321",
    );
  });

  it("recusa o que não é DDD + número", () => {
    for (const telefone of ["123", "(11) 8765-432", "(01) 98765-4321", "11 88765-43210"]) {
      assert.equal(esquemaDoCadastro.safeParse({ ...VISITANTE, telefone }).success, false, telefone);
    }
  });
});

describe("registro do lead do cadastro", () => {
  it("grava pelo servidor, com a chave de serviço, nas colunas do CRM", async () => {
    const resultado = await registrar({ ...VISITANTE, influenciadora: "parceira-teste" });

    assert.deepEqual(resultado, { success: true });
    const [insercao] = deUmVerbo("POST");
    assert.ok(insercao, "deveria inserir o lead");
    assert.equal(insercao.url.origin + insercao.url.pathname, `${URL_FALSA}/rest/v1/leads`);
    assert.equal(insercao.cabecalhos.get("apikey"), CHAVE_DE_SERVICO_FALSA);
    assert.equal(insercao.cabecalhos.get("authorization"), `Bearer ${CHAVE_DE_SERVICO_FALSA}`);
    assert.deepEqual(insercao.corpo, {
      name: "Visitante Sintética",
      phone: "5511987654321",
      source: "landing-cadastro",
      status: "novo",
      labels: ["landing-cadastro"],
      metadata: { objetivo: "Consultar disponibilidade", influenciadora: "parceira-teste" },
    });
  });

  it("só põe a influenciadora no metadata quando ela veio", async () => {
    await registrar({ ...VISITANTE, influenciadora: "   " });
    await registrar(VISITANTE);

    for (const insercao of deUmVerbo("POST")) {
      assert.deepEqual(insercao.corpo.metadata, { objetivo: "Consultar disponibilidade" });
    }
    assert.equal(deUmVerbo("POST").length, 2);
  });

  it("procura o telefone com e sem 9 e com e sem 55 antes de criar", async () => {
    await registrar(VISITANTE);

    const [busca] = deUmVerbo("GET");
    assert.ok(busca, "deveria procurar o lead antes de inserir");
    assert.equal(busca.url.pathname, "/rest/v1/leads");
    const filtro = busca.url.searchParams.get("phone");
    assert.match(filtro, /^in\.\(/);
    const variantes = filtro.slice(4, -1).split(",").map((v) => v.replaceAll('"', ""));
    assert.deepEqual(
      [...variantes].sort(),
      ["1187654321", "11987654321", "551187654321", "5511987654321"],
    );
  });

  it("telefone já cadastrado não vira outro lead: atualiza metadata e updated_at", async () => {
    respostas.GET = () =>
      responderJson(200, [{ id: "lead-existente", metadata: { chatwoot_id: 42 } }]);

    // Mesmo DDD e mesmos 8 últimos dígitos, sem o 9 e com o 55.
    const resultado = await registrar({ ...VISITANTE, telefone: "+55 11 8765-4321" });

    assert.deepEqual(resultado, { success: true });
    assert.equal(deUmVerbo("POST").length, 0, "não pode criar outro lead");
    const [atualizacao] = deUmVerbo("PATCH");
    assert.ok(atualizacao, "deveria atualizar o lead existente");
    assert.equal(atualizacao.url.searchParams.get("id"), "eq.lead-existente");
    assert.equal(atualizacao.cabecalhos.get("apikey"), CHAVE_DE_SERVICO_FALSA);
    assert.deepEqual(Object.keys(atualizacao.corpo).sort(), ["metadata", "updated_at"]);
    assert.deepEqual(atualizacao.corpo.metadata, {
      chatwoot_id: 42,
      objetivo: "Consultar disponibilidade",
    });
    assert.ok(!Number.isNaN(Date.parse(atualizacao.corpo.updated_at)));
  });

  it("erro do banco não chega ao visitante e o log fica só com o código", async () => {
    respostas.POST = () =>
      responderJson(400, {
        code: "42703",
        message: 'column "nome" of relation "leads" does not exist (5511987654321)',
        details: "Visitante Sintética",
        hint: null,
      });

    const resultado = await registrar(VISITANTE);

    assert.deepEqual(resultado, { success: false, error: MENSAGEM_FALHA_CADASTRO });
    assert.equal(
      MENSAGEM_FALHA_CADASTRO,
      "Não conseguimos registrar agora. Fale com a gente pelo WhatsApp.",
    );
    const erros = logs.filter((l) => l.nivel === "error");
    assert.equal(erros.length, 1);
    assert.match(erros[0].texto, /42703/);
    assert.doesNotMatch(erros[0].texto, /column|relation|does not exist/);
  });

  it("falha na busca também responde a frase neutra, sem inserir", async () => {
    respostas.GET = () => responderJson(401, { code: "42501", message: "permission denied" });

    const resultado = await registrar(VISITANTE);

    assert.deepEqual(resultado, { success: false, error: MENSAGEM_FALHA_CADASTRO });
    assert.equal(deUmVerbo("POST").length, 0);
    assert.match(logs.find((l) => l.nivel === "error").texto, /42501/);
  });

  it("queda de rede responde a frase neutra na hora, sem tentar de novo", async () => {
    // O visitante só vai para o WhatsApp quando a ação responde.
    let chamadas = 0;
    globalThis.fetch = async () => {
      chamadas += 1;
      throw new TypeError("fetch failed para 5511987654321");
    };

    const resultado = await registrar(VISITANTE);

    assert.deepEqual(resultado, { success: false, error: MENSAGEM_FALHA_CADASTRO });
    assert.equal(chamadas, 1);
  });

  it("nenhum log leva nome ou telefone, em sucesso ou em erro", async () => {
    await registrar(VISITANTE);
    respostas.GET = () => responderJson(200, [{ id: "lead-existente", metadata: null }]);
    await registrar(VISITANTE);
    respostas.PATCH = () => responderJson(400, { code: "23514", message: "Visitante Sintética 5511987654321" });
    await registrar(VISITANTE);
    globalThis.fetch = async () => {
      throw new TypeError("Visitante Sintética 5511987654321");
    };
    await registrar(VISITANTE);

    assert.ok(logs.length > 0, "as falhas deveriam ter sido registradas");
    for (const { texto } of logs) {
      assert.doesNotMatch(texto, /Visitante|Sint[ée]tica/);
      assert.doesNotMatch(texto, /87654321|8765-4321/);
    }
  });

  it("sem a chave de serviço, responde a frase neutra e o log diz qual variável falta", async () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    const resultado = await registrar(VISITANTE);

    assert.deepEqual(resultado, { success: false, error: MENSAGEM_FALHA_CADASTRO });
    assert.equal(requisicoes.length, 0, "não pode cair para a chave anônima");
    const erros = logs.filter((l) => l.nivel === "error");
    assert.equal(erros.length, 1);
    assert.match(erros[0].texto, /SUPABASE_SERVICE_ROLE_KEY/);
    assert.doesNotMatch(erros[0].texto, /NEXT_PUBLIC_SUPABASE_URL/);
    assert.ok(!erros[0].texto.includes(URL_FALSA));
    assert.ok(!erros[0].texto.includes(CHAVE_ANONIMA_FALSA));
  });

  it("sem a URL do projeto, o log também diz qual variável falta", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;

    const resultado = await registrar(VISITANTE);

    assert.deepEqual(resultado, { success: false, error: MENSAGEM_FALHA_CADASTRO });
    assert.equal(requisicoes.length, 0);
    const [erro] = logs.filter((l) => l.nivel === "error");
    assert.match(erro.texto, /NEXT_PUBLIC_SUPABASE_URL/);
    assert.ok(!erro.texto.includes(CHAVE_DE_SERVICO_FALSA));
  });
});
