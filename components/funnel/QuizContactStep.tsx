"use client";

import type { FormEvent } from "react";

import type { QuizSubmissionResult } from "@/app/avaliacao/actions";
import { Button, Card, CardBody, Eyebrow, Field, FieldSet, Notice } from "@/design-system";
import { buildDirectWhatsAppUrl } from "@/lib/funnel/quiz-config";

interface QuizCompletedCardProps {
  completed: QuizSubmissionResult;
}

export function QuizCompletedCard({ completed }: QuizCompletedCardProps) {
  return (
    <Card>
      <CardBody>
        <div aria-live="polite" className="funnel-card__body">
          <Eyebrow tone="wine">Acesso liberado</Eyebrow>
          <h1 className="funnel-card__title">Diagnóstico pronto — entre no Grupo VIP</h1>
          <p className="funnel-card__subtitle">
            Estamos abrindo o Grupo VIP da Pharmil no WhatsApp. Se o aplicativo não abriu
            automaticamente, toque no botão abaixo.
          </p>

          <pre className="funnel-summary">{completed.summary}</pre>

          <div className="funnel-actions funnel-actions--stack">
            <Button
              block
              href={completed.vipGroupUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Entrar no Grupo VIP no WhatsApp
            </Button>
          </div>

          <p className="funnel-secondary-link">
            Prefere atendimento individual?{" "}
            <a
              href={completed.whatsappUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Falar no atendimento direto (48) 99115-3151
            </a>
          </p>
        </div>
      </CardBody>
    </Card>
  );
}

interface QuizContactStepProps {
  firstName: string;
  phone: string;
  errorMessage: string | null;
  isExecuting: boolean;
  onFirstNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function QuizContactStep({
  firstName,
  phone,
  errorMessage,
  isExecuting,
  onFirstNameChange,
  onPhoneChange,
  onBack,
  onSubmit,
}: QuizContactStepProps) {
  const directWhatsappUrl = buildDirectWhatsAppUrl(
    process.env.NEXT_PUBLIC_WHATSAPP_OFFICIAL_NUMBER,
  );

  return (
    <form className="funnel-form" onSubmit={onSubmit}>
      <div>
        <Eyebrow tone="wine">Resumo pronto</Eyebrow>
        <h1 className="funnel-card__title">
          Libere seu acesso ao Grupo VIP da Pharmil
        </h1>
        <p className="funnel-card__subtitle">
          Informe seu nome e WhatsApp para concluir a avaliação e entrar no Grupo VIP com
          condições, avisos de lote e suporte da equipe.
        </p>
      </div>

      <FieldSet>
        <Field
          autoComplete="given-name"
          disabled={isExecuting}
          label="Primeiro nome"
          maxLength={80}
          name="firstName"
          onChange={(e) => onFirstNameChange(e.target.value)}
          placeholder="Como prefere ser chamado"
          required
          value={firstName}
        />

        <Field
          autoComplete="tel"
          disabled={isExecuting}
          inputMode="tel"
          label="WhatsApp com DDD"
          maxLength={20}
          name="phone"
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="(48) 99999-9999"
          required
          type="tel"
          value={phone}
        />
      </FieldSet>

      {errorMessage ? (
        <Notice tone="danger" title="Confira seus dados">
          {errorMessage}
        </Notice>
      ) : null}

      <div className="funnel-actions">
        <Button
          disabled={isExecuting}
          onClick={onBack}
          size="sm"
          variant="secondary"
        >
          Revisar
        </Button>
        <Button block loading={isExecuting} type="submit">
          Entrar no Grupo VIP no WhatsApp
        </Button>
      </div>

      <p className="funnel-secondary-link">
        Prefere falar diretamente com a equipe?{" "}
        <a
          href={directWhatsappUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          Atendimento direto no WhatsApp (48) 99115-3151
        </a>
      </p>

      <p className="funnel-lgpd">
        Canal oficial Pharmil · Dados protegidos conforme a LGPD
      </p>
    </form>
  );
}
