"use server";

import { esquemaDoCadastro, registrarLeadDoCadastro } from "@/lib/cadastro-lead";
import { actionClient } from "@/lib/safe-action";

export const salvarLeadAction = actionClient
  .inputSchema(esquemaDoCadastro)
  .action(({ parsedInput }) => registrarLeadDoCadastro(parsedInput));
