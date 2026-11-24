"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useAction } from "next-safe-action/hooks";

import {
  submitQuizAvaliacao,
  type QuizSubmissionResult,
} from "@/app/avaliacao/actions";
import { Button, Card, CardBody, Eyebrow } from "@/design-system";
import {
  labelForQuizOption,
  QUIZ_STEPS,
  type QuizStepConfig,
} from "@/lib/funnel/quiz-config";
import type { FunnelAttribution } from "@/lib/funnel/traffic-routing";

import { ArrowRightIcon, CheckIcon } from "./FunnelIcons";
import { QuizCompletedCard, QuizContactStep } from "./QuizContactStep";

type StepId = QuizStepConfig["id"];
type AnswersState = Partial<Record<StepId, string>>;

interface QuizAvaliacaoClientProps {
  attribution: FunnelAttribution;
}

const TOTAL_STAGES = QUIZ_STEPS.length + 1;
const OPTION_LETTERS = ["A", "B", "C", "D"] as const;
const ANALYSIS_STEPS = [
  "Objetivo e ritmo da rotina identificados",
  "Prioridade de atendimento calibrada",
  "Convite do Grupo VIP Pharmil preparado",
] as const;

export function QuizAvaliacaoClient({ attribution }: QuizAvaliacaoClientProps) {
  const [stageIndex, setStageIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completed, setCompleted] = useState<QuizSubmissionResult | null>(null);

  useEffect(() => {
    if (!isAnalyzing) return undefined;
    const timer = window.setTimeout(() => {
      setIsAnalyzing(false);
      setStageIndex(QUIZ_STEPS.length);
    }, 1050);
    return () => window.clearTimeout(timer);
  }, [isAnalyzing]);

  const { execute, isExecuting } = useAction(submitQuizAvaliacao, {
    onSuccess: (result) => {
      if (result.data?.success) {
        setCompleted(result.data.data);
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
    : isAnalyzing
      ? 92
      : Math.round(((stageIndex + 1) / TOTAL_STAGES) * 100);

  function handleSelectOption(stepId: StepId, value: string) {
    setErrorMessage(null);
    setAnswers((prev) => ({ ...prev, [stepId]: value }));

    // Ao concluir a 4ª pergunta, exibe o feedback curto de análise de perfil.
    if (stageIndex === QUIZ_STEPS.length - 1) {
      setIsAnalyzing(true);
      return;
    }

    setStageIndex((current) => Math.min(current + 1, QUIZ_STEPS.length));
  }

  function handleBack() {
    setErrorMessage(null);
    setIsAnalyzing(false);
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

  const currentStep = isAnalyzing ? undefined : QUIZ_STEPS[stageIndex];
  const profileHighlights = [
    answers.objetivo ? labelForQuizOption("objetivo", answers.objetivo) : null,
    answers.momento ? labelForQuizOption("momento", answers.momento) : null,
  ].filter((item): item is string => Boolean(item));

  return (
    <Card>
      <div className="funnel-progress">
        <div className="funnel-progress__meta">
          <div className="funnel-progress__label">
            <span className="funnel-dots" aria-hidden="true">
              {Array.from({ length: TOTAL_STAGES }, (_, idx) => {
                const activeIdx = isAnalyzing ? QUIZ_STEPS.length : stageIndex;
                const state =
                  idx < activeIdx ? "is-done" : idx === activeIdx ? "is-current" : "";
                return <i className={state} key={idx} />;
              })}
            </span>
            <span>
              {isAnalyzing
                ? "Montando diagnóstico"
                : currentStep
                  ? `Pergunta ${currentStep.stepNumber} de ${QUIZ_STEPS.length}`
                  : "Etapa final"}
            </span>
          </div>
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
          {isAnalyzing ? (
            <div aria-live="polite" className="funnel-analyzing funnel-step-enter">
              <div aria-hidden="true" className="funnel-analyzing__pulse" />
              <Eyebrow tone="orange">Análise personalizada</Eyebrow>
              <h1 className="funnel-card__title">
                Preparando seu acesso ao Grupo VIP
              </h1>
              <p className="funnel-card__subtitle">
                Organizamos suas respostas para a equipe Pharmil orientar você com mais
                clareza.
              </p>
              <ul className="funnel-analyzing__list">
                {ANALYSIS_STEPS.map((label, idx) => (
                  <li
                    className="funnel-analyzing__item"
                    key={label}
                    style={{ animationDelay: `${idx * 220}ms` }}
                  >
                    <span aria-hidden="true" className="funnel-analyzing__check">
                      <CheckIcon size={14} strokeWidth={2.75} />
                    </span>
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : currentStep ? (
            <div className="funnel-step-enter" key={currentStep.id}>
              <Eyebrow tone="orange">Etapa 0{currentStep.stepNumber}</Eyebrow>
              <h1 className="funnel-card__title">{currentStep.title}</h1>
              <p className="funnel-card__subtitle">{currentStep.subtitle}</p>

              <div
                aria-label={currentStep.title}
                className="funnel-options"
                role="radiogroup"
              >
                {currentStep.options.map((option, idx) => {
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
                      style={{ animationDelay: `${idx * 45}ms` }}
                      type="button"
                    >
                      <span aria-hidden="true" className="funnel-option__badge">
                        {OPTION_LETTERS[idx]}
                      </span>
                      <span className="funnel-option__content">
                        <span className="funnel-option__label">{option.label}</span>
                        <span className="funnel-option__detail">{option.detail}</span>
                      </span>
                      <span aria-hidden="true" className="funnel-option__arrow">
                        <ArrowRightIcon size={17} strokeWidth={2.5} />
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
              profileHighlights={profileHighlights}
            />
          )}
        </div>
      </CardBody>
    </Card>
  );
}
