"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import type { QuizSubmissionResult } from "@/app/avaliacao/actions";
import { Button, Card, CardBody, Eyebrow, Field, FieldSet, Notice } from "@/design-system";
import {
  buildDirectWhatsAppUrl,
  formatBrazilianWhatsAppDisplay,
} from "@/lib/funnel/quiz-config";

import { ChatBubbleIcon, CheckIcon, CopyIcon, ShieldIcon } from "./FunnelIcons";

interface QuizCompletedCardProps {
  completed: QuizSubmissionResult;
}

export function QuizCompletedCard({ completed }: QuizCompletedCardProps) {
  const [copied, setCopied] = useState(false);
  const directWhatsappDisplay = formatBrazilianWhatsAppDisplay(
    process.env.NEXT_PUBLIC_WHATSAPP_OFFICIAL_NUMBER,
  );

  async function handleCopySummary() {
    try {
      await navigator.clipboard.writeText(completed.summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard indisponível em alguns in-app browsers; botão permanece funcional.
    }
  }

  return (
    <Card>
      <CardBody>
        <div aria-live="polite" className="funnel-card__body funnel-step-enter">
          <div className="funnel-success-header">
            <span aria-hidden="true" className="funnel-success-badge">
              <CheckIcon size={22} strokeWidth={2.75} />
            </span>
            <div>
              <Eyebrow tone="wine">Acesso liberado</Eyebrow>
              <h1 className="funnel-card__title funnel-card__title--tight">
                Diagnóstico pronto — entre no Grupo VIP
              </h1>
            </div>
          </div>

          <p className="funnel-card__subtitle">
            Estamos abrindo o Grupo VIP oficial da Pharmil no WhatsApp. Se o aplicativo
            não abriu automaticamente, toque no botão abaixo.
          </p>

          <div className="funnel-summary-box">
            <div className="funnel-summary-box__bar">
              <span>Resumo da sua avaliação</span>
              <button
                aria-label={copied ? "Resumo copiado" : "Copiar resumo"}
                className="funnel-copy-btn"
                onClick={handleCopySummary}
                type="button"
              >
                <span className="funnel-icon-swap">
                  <CopyIcon aria-hidden={copied} size={15} strokeWidth={2.2} />
                  <CheckIcon aria-hidden={!copied} size={15} strokeWidth={2.6} />
                </span>
                <span>{copied ? "Copiado" : "Copiar"}</span>
              </button>
            </div>
            <pre className="funnel-summary">{completed.summary}</pre>
          </div>

          <div className="funnel-actions funnel-actions--stack">
            <Button
              block
              href={completed.vipGroupUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <ChatBubbleIcon size={18} strokeWidth={2.5} />
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
              Falar no atendimento direto {directWhatsappDisplay}
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
  profileHighlights: readonly string[];
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
  profileHighlights,
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
  const directWhatsappDisplay = formatBrazilianWhatsAppDisplay(
    process.env.NEXT_PUBLIC_WHATSAPP_OFFICIAL_NUMBER,
  );

  return (
    <form className="funnel-form funnel-step-enter" onSubmit={onSubmit}>
      <div>
        <Eyebrow tone="wine">Diagnóstico concluído</Eyebrow>
        <h1 className="funnel-card__title">
          Libere seu acesso ao Grupo VIP da Pharmil
        </h1>
        <p className="funnel-card__subtitle">
          Informe seu nome e WhatsApp para concluir a avaliação e receber acesso ao
          Grupo VIP com condições de cliente, avisos de lote e suporte da equipe.
        </p>
      </div>

      {profileHighlights.length > 0 ? (
        <div aria-label="Resumo do perfil selecionado" className="funnel-profile-pills">
          {profileHighlights.map((item) => (
            <span className="funnel-profile-pill" key={item}>
              <CheckIcon size={13} strokeWidth={2.6} />
              {item}
            </span>
          ))}
        </div>
      ) : null}

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
          <ChatBubbleIcon size={18} strokeWidth={2.5} />
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
          Atendimento direto no WhatsApp {directWhatsappDisplay}
        </a>
      </p>

      <p className="funnel-lgpd">
        <ShieldIcon size={15} strokeWidth={2.2} />
        <span>Canal oficial Pharmil · Dados protegidos conforme a LGPD</span>
      </p>
    </form>
  );
}
