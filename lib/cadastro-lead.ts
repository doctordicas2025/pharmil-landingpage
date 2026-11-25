import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

// Grava o lead do /cadastro na tabela `leads` do CRM do painel (mesmo projeto
// Supabase). Roda só no servidor: a chave de serviço nunca vai ao navegador, e
// a RLS de `leads` não deixa a chave anônima inserir.

export const MENSAGEM_FALHA_CADASTRO =
  "Não conseguimos registrar agora. Fale com a gente pelo WhatsApp.";

const ORIGEM = "landing-cadastro";

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

export const esquemaDoCadastro = z.object({
  nome: z.string().trim().min(2, "Nome é obrigatório").max(120),
  telefone: z.string().max(40).transform((valor, ctx) => {
    const telefone = normalizarTelefone(valor);
    if (!telefone) {
      ctx.addIssue({ code: "custom", message: "Telefone inválido" });
      return z.NEVER;
    }
    return telefone;
  }),
  objetivo: z.string().trim().min(1, "Objetivo é obrigatório").max(120),
  influenciadora: z.string().trim().max(80).optional(),
});

export type LeadDoCadastro = z.output<typeof esquemaDoCadastro>;

export type ResultadoDoCadastro = { success: true } | { success: false; error: string };

const FALHA: ResultadoDoCadastro = { success: false, error: MENSAGEM_FALHA_CADASTRO };

/** Nada de nome, telefone ou mensagem do banco no log: só a etapa e o código. */
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

/**
 * Cria o lead, ou atualiza o `metadata` de quem já está no CRM com o mesmo
 * telefone. Falha nunca derruba o visitante: ele recebe a frase neutra.
 */
export async function registrarLeadDoCadastro(
  lead: LeadDoCadastro,
): Promise<ResultadoDoCadastro> {
  const supabase = clienteDeServico();
  if (!supabase) return FALHA;

  const metadata: Record<string, string> = { objetivo: lead.objetivo };
  if (lead.influenciadora) metadata.influenciadora = lead.influenciadora;

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
      const { error } = await supabase
        .from("leads")
        .update({
          metadata: { ...(existente.metadata ?? {}), ...metadata },
          updated_at: new Date().toISOString(),
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
      metadata,
    });
    return error ? registrarFalha("insercao", error.code) : { success: true };
  } catch (erro) {
    return registrarFalha("excecao", erro instanceof Error ? erro.name : undefined);
  }
}
