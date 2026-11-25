import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

// Grava o lead do /cadastro na tabela `leads` do CRM do painel (mesmo projeto
// Supabase). Roda só no servidor: a chave de serviço nunca vai ao navegador, e
// a RLS de `leads` não deixa a chave anônima inserir. O formulário é público e
// sem login, então ninguém prova que o telefone é seu: o cadastro só cria lead
// novo ou acrescenta ao existente, nunca troca o que já está lá.

export const MENSAGEM_FALHA_CADASTRO =
  "Não conseguimos registrar agora. Fale com a gente pelo WhatsApp.";

/** As opções do formulário; a página as passa ao `CadastroForm`. */
export const OBJETIVOS_DO_CADASTRO = [
  "Entender como funciona",
  "Consultar disponibilidade",
  "Tirar dúvidas sobre entrega",
] as const;

export type ObjetivoDoCadastro = (typeof OBJETIVOS_DO_CADASTRO)[number];

const ORIGEM = "landing-cadastro";
const MAXIMO_NO_HISTORICO = 10;

/**
 * Só dígitos, com 55 na frente. Tira o 55 enquanto sobra um número nacional,
 * como a `sdr_contact_phone_key` do painel, para o DDD 55 (RS) não sumir.
 */
function normalizarTelefone(bruto: string): string | null {
  let digitos = bruto.replace(/\D/g, "");
  while (digitos.length >= 12 && digitos.startsWith("55")) digitos = digitos.slice(2);
  return /^[1-9]{2}9?\d{8}$/.test(digitos) ? `55${digitos}` : null;
}

/**
 * Formas em que o mesmo telefone já pode estar no CRM. O painel identifica a
 * pessoa por DDD + 8 últimos dígitos (`sdr_contact_phone_key`), com ou sem o 9
 * e o 55; os escritores dele gravam só dígitos.
 */
function formasDoMesmoTelefone(telefone: string): string[] {
  const nacional = telefone.slice(2);
  const ddd = nacional.slice(0, 2);
  const oitoFinais = nacional.slice(-8);
  return [`${ddd}${oitoFinais}`, `${ddd}9${oitoFinais}`].flatMap((n) => [n, `55${n}`]);
}

// Mesma regra de nome da `vincular_lead_sdr` do painel.
const SEM_CONTROLE_NEM_TAG = /^[^\p{Cc}<>]*$/u;

export const esquemaDoCadastro = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "Nome é obrigatório")
    .max(120)
    .regex(SEM_CONTROLE_NEM_TAG, "Nome inválido"),
  telefone: z
    .string()
    .max(40)
    .transform((valor, ctx) => {
      const telefone = normalizarTelefone(valor);
      if (!telefone) {
        ctx.addIssue({ code: "custom", message: "Telefone inválido" });
        return z.NEVER;
      }
      return telefone;
    }),
  objetivo: z.enum(OBJETIVOS_DO_CADASTRO, "Objetivo inválido"),
  influenciadora: z
    .string()
    .trim()
    .max(40)
    .regex(SEM_CONTROLE_NEM_TAG, "Indicação inválida")
    .optional(),
});

export type LeadDoCadastro = z.output<typeof esquemaDoCadastro>;

export type ResultadoDoCadastro = { success: true } | { success: false; error: string };

const FALHA: ResultadoDoCadastro = { success: false, error: MENSAGEM_FALHA_CADASTRO };

/**
 * Limite de tentativas por IP, em memória. Vale por instância do servidor,
 * então segura rajada de um mesmo IP, não um ataque distribuído.
 */
export function criarLimiteDeTentativas({
  maximo,
  janelaMs,
  relogio = Date.now,
}: {
  maximo: number;
  janelaMs: number;
  relogio?: () => number;
}): (ip: string) => boolean {
  const tentativas = new Map<string, number[]>();
  return (ip) => {
    const agora = relogio();
    const naJanela = (momentos: number[]) => momentos.filter((t) => agora - t < janelaMs);
    const recentes = naJanela(tentativas.get(ip) ?? []);
    const cabe = recentes.length < maximo;
    if (cabe) recentes.push(agora);
    tentativas.set(ip, recentes);
    // Não deixa o mapa crescer sem fim numa instância longa.
    if (tentativas.size > 1000) {
      for (const [chave, momentos] of tentativas) {
        if (naJanela(momentos).length === 0) tentativas.delete(chave);
      }
    }
    return cabe;
  };
}

const cabeNoLimite = criarLimiteDeTentativas({ maximo: 10, janelaMs: 10 * 60 * 1000 });

/** Na Vercel os dois cabeçalhos trazem o IP público de quem acessou. */
export function ipDoVisitante(cabecalhos: Headers): string | null {
  const encaminhado = cabecalhos.get("x-forwarded-for")?.split(",")[0]?.trim();
  return encaminhado || cabecalhos.get("x-real-ip")?.trim() || null;
}

/** Nada de nome, telefone, IP ou mensagem do banco no log: só a etapa e o código. */
function registrarFalha(etapa: string, codigo: unknown): ResultadoDoCadastro {
  console.error("[cadastro] lead_nao_registrado", {
    etapa,
    codigo: typeof codigo === "string" && codigo ? codigo : "sem_codigo",
  });
  return FALHA;
}

function clienteDeServico() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const chave = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !chave) {
    const faltando = [
      ...(url ? [] : ["NEXT_PUBLIC_SUPABASE_URL"]),
      ...(chave ? [] : ["SUPABASE_SERVICE_ROLE_KEY"]),
    ];
    console.error("[cadastro] supabase_nao_configurado", { faltando });
    return null;
  }
  // Sem nova tentativa: o visitante só segue para o WhatsApp quando a ação
  // responde, e as tentativas do supabase-js somam 7 s quando a rede cai.
  return createClient(url, chave, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { retry: false },
  });
}

type Metadata = Record<string, unknown>;

const temValor = (valor: unknown) => valor !== undefined && valor !== null && valor !== "";

/**
 * O metadata de quem já está no CRM só ganha: chave com valor fica como está,
 * a que falta é preenchida, e o cadastro entra em `historico_cadastro` (os 10
 * mais recentes), a única chave que este módulo escreve por cima.
 */
function acrescentarAoMetadata(anterior: unknown, cadastro: Metadata, em: string): Metadata {
  const atual: Metadata =
    anterior && typeof anterior === "object" && !Array.isArray(anterior) ? { ...anterior } : {};
  for (const [chave, valor] of Object.entries(cadastro)) {
    if (!temValor(atual[chave])) atual[chave] = valor;
  }
  const historico = Array.isArray(atual.historico_cadastro) ? atual.historico_cadastro : [];
  atual.historico_cadastro = [...historico, { em, ...cadastro }].slice(-MAXIMO_NO_HISTORICO);
  return atual;
}

/**
 * Cria o lead, ou acrescenta ao `metadata` de quem já está no CRM com o mesmo
 * telefone. Falha nunca derruba o visitante: ele recebe a frase neutra.
 */
export async function registrarLeadDoCadastro(
  lead: LeadDoCadastro,
  ip: string | null,
): Promise<ResultadoDoCadastro> {
  if (!cabeNoLimite(ip ?? "sem-ip")) {
    console.warn("[cadastro] limite_de_tentativas");
    return FALHA;
  }

  const supabase = clienteDeServico();
  if (!supabase) return FALHA;

  const cadastro: Metadata = { objetivo: lead.objetivo };
  if (lead.influenciadora) cadastro.influenciadora = lead.influenciadora;

  try {
    const busca = await supabase
      .from("leads")
      .select("id, metadata")
      .in("phone", formasDoMesmoTelefone(lead.telefone))
      .order("created_at", { ascending: true })
      .limit(1);
    if (busca.error) return registrarFalha("busca", busca.error.code);

    const existente = busca.data[0];
    if (existente) {
      const agora = new Date().toISOString();
      const { error } = await supabase
        .from("leads")
        .update({
          metadata: acrescentarAoMetadata(existente.metadata, cadastro, agora),
          updated_at: agora,
        })
        .eq("id", existente.id);
      return error ? registrarFalha("atualizacao", error.code) : { success: true };
    }

    const { error } = await supabase.from("leads").insert({
      name: lead.nome,
      phone: lead.telefone,
      source: ORIGEM,
      status: "novo",
      labels: [ORIGEM],
      metadata: cadastro,
    });
    return error ? registrarFalha("insercao", error.code) : { success: true };
  } catch (erro) {
    return registrarFalha("excecao", erro instanceof Error ? erro.name : undefined);
  }
}
