"use client";

import { useSearchParams } from "next/navigation";
import { useState, FormEvent, useTransition } from "react";
import { salvarLeadAction } from "./actions";

export default function CadastroForm() {
  const searchParams = useSearchParams();
  const influencer = searchParams.get("inf") || "";

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    startTransition(async () => {
      // 1. Salvar no Supabase
      const result = await salvarLeadAction({
        nome,
        telefone,
        objetivo,
        influenciadora: influencer,
      });

      if (result?.data?.success) {
        // 2. Redirecionar para o WhatsApp
        const whatsappNumber = "5561999969091";
        const mensagem = `Olá, meu nome é ${nome}, meu telefone é ${telefone}. Meu objetivo de emagrecimento é: ${objetivo}. Fui indicado(a) por: ${influencer || 'Ninguém'}.`;
        
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensagem)}`;
        window.location.href = whatsappUrl;
      } else {
        alert("Ocorreu um erro ao salvar seus dados. Por favor, tente novamente.");
      }
    });
  };

  const objetivos = [
    'Perder peso rápido',
    'Reeducação alimentar',
    'Definição muscular'
  ];

  return (
    <div className="cadastro-container">
      <div className="cadastro-header">
        <h1 className="section-heading" style={{fontSize: "2rem"}}>Bem-vindo(a) à Pharmil</h1>
        <p className="section-intro">Para um atendimento personalizado, por favor preencha os dados abaixo.</p>
      </div>

      <form onSubmit={handleSubmit} className="cadastro-form">
        <div className="form-group">
          <label htmlFor="nome">Nome Completo</label>
          <input 
            type="text" 
            id="nome" 
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required 
            placeholder="Seu nome"
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefone">Telefone (WhatsApp)</label>
          <input 
            type="tel" 
            id="telefone" 
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required 
            placeholder="(11) 99999-9999"
          />
        </div>

        <div className="form-group">
          <label>Qual o seu principal objetivo?</label>
          <div className="options-group">
            {objetivos.map((opt) => (
              <label key={opt} className={`option-label ${objetivo === opt ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="objetivo" 
                  value={opt}
                  checked={objetivo === opt}
                  onChange={(e) => setObjetivo(e.target.value)}
                  required
                  className="sr-only"
                />
                <span className="option-text">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="button button-primary submit-btn" disabled={isPending}>
          {isPending ? 'Redirecionando...' : 'Continuar para o WhatsApp'}
          {!isPending && (
            <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7"/>
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}
