import { Suspense } from "react";
import CadastroForm from "./CadastroForm";

export default function CadastroPage() {
  return (
    <main className="cadastro-page">
      <div className="shell">
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem' }}>Carregando formulário...</div>}>
          <CadastroForm />
        </Suspense>
      </div>
    </main>
  );
}
