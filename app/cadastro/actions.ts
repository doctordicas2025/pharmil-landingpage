"use server";

import { headers } from "next/headers";

import {
  esquemaDoCadastro,
  ipDoVisitante,
  registrarLeadDoCadastro,
} from "@/lib/cadastro-lead";
import { actionClient } from "@/lib/safe-action";

export const salvarLeadAction = actionClient
  .inputSchema(esquemaDoCadastro)
  .action(async ({ parsedInput }) =>
    registrarLeadDoCadastro(parsedInput, ipDoVisitante(await headers())),
  );
