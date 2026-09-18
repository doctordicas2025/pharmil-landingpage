"use client";

import { useSearchParams } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";

import { Button, Field, FieldSet, OptionGroup } from "@/design-system";

import { salvarLeadAction } from "./actions";

const WHATSAPP_NUMBER = "5561999969091";

const objetivos = [
  "Entender como funciona",
  "Consultar disponibilidade",
  "Tirar dúvidas sobre entrega",
] as const;

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
      let mensagem = `Olá, meu nome é ${nome}. Gostaria de: ${objetivo}.`;
      if (influencer) {
        mensagem += ` Fui indicado(a) por: ${influencer}.`;
      }
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;

      // O registro do lead nao pode barrar o contato: se o banco falhar, o
      // atendimento segue e a falha fica no console.
      try {
        const result = await salvarLeadAction({
          nome,
          telefone,
          objetivo,
          influenciadora: influencer,
        });

        if (!result?.data?.success) {
          console.error("Lead nao registrado:", result?.data?.error ?? result?.validationErrors);
        }
      } catch (err) {
        console.error("Falha ao registrar lead:", err);
      }

      window.location.href = whatsappUrl;
    });
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-header">
        <h1 className="section-heading" style={{ fontSize: "2rem" }}>
          Bem-vindo(a) à Pharmil
        </h1>
        <p className="section-intro">
          Para um atendimento personalizado, por favor preencha os dados abaixo.
        </p>
      </div>

      <form className="cadastro-form" onSubmit={handleSubmit}>
        <FieldSet>
          <Field
            label="Nome completo"
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome"
            required
            value={nome}
          />

          <Field
            label="Telefone (WhatsApp)"
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(11) 99999-9999"
            required
            type="tel"
            value={telefone}
          />

          <OptionGroup
            label="Como podemos ajudar?"
            name="objetivo"
            onChange={setObjetivo}
            options={objetivos}
            value={objetivo}
          />

          <Button block disabled={!objetivo} loading={isPending} type="submit">
            {isPending ? "Redirecionando" : "Continuar para o WhatsApp"}
          </Button>
        </FieldSet>
      </form>
    </div>
  );
}
