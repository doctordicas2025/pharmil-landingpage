import { Suspense } from "react";

import { OBJETIVOS_DO_CADASTRO } from "@/lib/cadastro-lead";

import CadastroForm from "./CadastroForm";

export default function CadastroPage() {
  return (
    <main className="cadastro-page">
      <div className="shell">
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem' }}>Carregando formulário...</div>}>
          {/* A lista vem do servidor: é a mesma que a ação aceita. */}
          <CadastroForm objetivos={OBJETIVOS_DO_CADASTRO} />
        </Suspense>
      </div>
    </main>
  );
}
