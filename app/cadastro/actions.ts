"use server";

import { z } from "zod";
import { actionClient } from "@/lib/safe-action";
import { supabase } from "@/lib/supabase";

const schema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  telefone: z.string().min(10, "Telefone inválido"),
  objetivo: z.string().min(1, "Objetivo é obrigatório"),
  influenciadora: z.string().optional(),
});

export const salvarLeadAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { nome, telefone, objetivo, influenciadora } }) => {
    
    // Inserir no Supabase (na tabela "leads")
    const { error } = await supabase
      .from("leads")
      .insert([
        {
          nome,
          telefone,
          objetivo,
          influenciadora: influenciadora || 'Nenhuma',
        }
      ]);

    if (error) {
      return { success: false, error: "Erro ao salvar o lead no banco de dados." };
    }

    return { success: true };
  });
