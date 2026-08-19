import { Suspense } from "react";
import CadastroForm from "./CadastroForm";
import { Header } from "@/components/Header";
import Footer from "@/components/sections/Footer";
import { getContactHref } from "@/lib/site-config";

export default function CadastroPage() {
  const contactHref = getContactHref();

  return (
    <>
      <Header contactHref={contactHref} />
      <main className="cadastro-page">
        <div className="shell">
          <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem' }}>Carregando formulário...</div>}>
            <CadastroForm />
          </Suspense>
        </div>
      </main>
      <Footer contactHref={contactHref} />
    </>
  );
}
