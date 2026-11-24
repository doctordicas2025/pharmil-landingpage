"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";

import {
  submitQuizAvaliacao,
  type QuizSubmissionResult,
} from "@/app/avaliacao/actions";
import { Button, Card, CardBody } from "@/design-system";
import { QUIZ_STEPS, type QuizStepConfig } from "@/lib/funnel/quiz-config";
import type { FunnelAttribution } from "@/lib/funnel/traffic-routing";

import { QuizCompletedCard, QuizContactStep } from "./QuizContactStep";

type StepId = QuizStepConfig["id"];
type AnswersState = Partial<Record<StepId, string>>;

interface QuizAvaliacaoClientProps {
  attribution: FunnelAttribution;
}

const TOTAL_STAGES = QUIZ_STEPS.length + 1;

export function QuizAvaliacaoClient({ attribution }: QuizAvaliacaoClientProps) {
  const [stageIndex, setStageIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completed, setCompleted] = useState<QuizSubmissionResult | null>(null);

  const { execute, isExecuting } = useAction(submitQuizAvaliacao, {
    onSuccess: (result) => {
      if (result.data?.success) {
        setCompleted(result.data.data);
        // O cartão de conclusão mantém botão explícito caso o in-app browser segure o redirect.
        window.location.assign(result.data.data.vipGroupUrl);
        return;
      }
      setErrorMessage(result.data?.error ?? "Não foi possível concluir agora.");
    },
    onError: () => {
      setErrorMessage("Falha de conexão. Tente novamente em instantes.");
    },
  });

  const progressPercent = completed
    ? 100
    : Math.round(((stageIndex + 1) / TOTAL_STAGES) * 100);

  function handleSelectOption(stepId: StepId, value: string) {
    setErrorMessage(null);
    setAnswers((prev) => ({ ...prev, [stepId]: value }));
    setStageIndex((current) => Math.min(current + 1, QUIZ_STEPS.length));
  }

  function handleBack() {
    setErrorMessage(null);
    setStageIndex((current) => Math.max(0, current - 1));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (firstName.trim().length < 2) {
      setErrorMessage("Informe seu primeiro nome para concluir a avaliação.");
      return;
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 13) {
      setErrorMessage("Informe um WhatsApp válido com DDD.");
      return;
    }

    if (
      !answers.objetivo ||
      !answers.experiencia ||
      !answers.desafio ||
      !answers.momento
    ) {
      setErrorMessage("Responda todas as etapas antes de continuar.");
      return;
    }

    execute({
      firstName: firstName.trim(),
      phone: phoneDigits,
      objetivo: answers.objetivo as
        | "controle_medidas"
        | "energia_disposicao"
        | "estetica_recuperacao"
        | "orientacao_completa",
      experiencia: answers.experiencia as
        | "primeira_vez"
        | "ja_iniciou_antes"
        | "ja_utiliza"
        | "pesquisando_opcoes",
      desafio: answers.desafio as
        | "escolher_protocolo"
        | "procedencia_seguranca"
        | "constancia_rotina"
        | "condicoes_entrega",
      momento: answers.momento as
        | "esta_semana"
        | "proximos_15_dias"
        | "este_mes"
        | "apenas_informacoes",
      utm_source: attribution.utm_source,
      utm_medium: attribution.utm_medium,
      utm_campaign: attribution.utm_campaign,
      utm_content: attribution.utm_content,
      utm_term: attribution.utm_term,
      fbclid: attribution.fbclid,
      ttclid: attribution.ttclid,
      pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
    });
  }

  if (completed) {
    return <QuizCompletedCard completed={completed} />;
  }

  const currentStep = QUIZ_STEPS[stageIndex];

  return (
    <Card>
      <div className="funnel-progress">
        <div className="funnel-progress__meta">
          <span>
            {currentStep
              ? `Pergunta ${currentStep.stepNumber} de ${QUIZ_STEPS.length}`
              : "Etapa final"}
          </span>
          <span className="funnel-progress__pct">{progressPercent}%</span>
        </div>
        <div
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={progressPercent}
          className="funnel-progress__track"
          role="progressbar"
        >
          <div
            className="funnel-progress__bar"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <CardBody>
        <div className="funnel-card__body">
          {currentStep ? (
            <div>
              <h1 className="funnel-card__title">{currentStep.title}</h1>
              <p className="funnel-card__subtitle">{currentStep.subtitle}</p>

              <div
                aria-label={currentStep.title}
                className="funnel-options"
                role="radiogroup"
              >
                {currentStep.options.map((option) => {
                  const selected = answers[currentStep.id] === option.value;
                  return (
                    <button
                      aria-checked={selected}
                      className={
                        selected ? "funnel-option is-selected" : "funnel-option"
                      }
                      key={option.value}
                      onClick={() => handleSelectOption(currentStep.id, option.value)}
                      role="radio"
                      type="button"
                    >
                      <span className="funnel-option__content">
                        <span className="funnel-option__label">{option.label}</span>
                        <span className="funnel-option__detail">{option.detail}</span>
                      </span>
                      <span aria-hidden="true" className="funnel-option__arrow">
                        →
                      </span>
                    </button>
                  );
                })}
              </div>

              {stageIndex > 0 ? (
                <div className="funnel-back">
                  <Button onClick={handleBack} size="sm" variant="secondary">
                    Voltar etapa
                  </Button>
                </div>
              ) : null}
            </div>
          ) : (
            <QuizContactStep
              errorMessage={errorMessage}
              firstName={firstName}
              isExecuting={isExecuting}
              onBack={handleBack}
              onFirstNameChange={setFirstName}
              onPhoneChange={setPhone}
              onSubmit={handleSubmit}
              phone={phone}
            />
          )}
        </div>
      </CardBody>
    </Card>
  );
}
