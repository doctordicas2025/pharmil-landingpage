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
    
    console.log("Tentando salvar lead no Supabase...", { nome, telefone, objetivo, influenciadora });

    try {
      // Inserir no Supabase (na tabela "leads")
      const { error, data } = await supabase
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
        console.error("Erro do Supabase:", error);
        return { success: false, error: `Erro Banco: ${error.message} (${error.code})` };
      }

      console.log("Salvo com sucesso!");
      return { success: true };
    } catch (err: any) {
      console.error("Erro inesperado:", err);
      return { success: false, error: `Erro Servidor: ${err.message}` };
    }
  });
