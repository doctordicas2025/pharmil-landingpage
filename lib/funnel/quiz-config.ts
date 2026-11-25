// =============================================================
// Pharmil — Configuração e Contrato do Quiz de Avaliação (/avaliacao)
//
// Fonte única das 4 perguntas de diagnóstico de rotina, schema Zod,
// link oficial do Grupo VIP no WhatsApp e link secundário de
// atendimento direto.
// =============================================================

import { z } from "zod";

export const DEFAULT_WHATSAPP_NUMBER = "5561999969091";
export const DEFAULT_WHATSAPP_VIP_GROUP_URL =
  "https://chat.whatsapp.com/JcIISmSCGo28QDWYeQtmDX?s=cl&p=i&iam=2";

export interface QuizOption {
  value: string;
  label: string;
  detail: string;
}

export interface QuizStepConfig {
  id: "objetivo" | "experiencia" | "desafio" | "momento";
  stepNumber: number;
  title: string;
  subtitle: string;
  options: readonly QuizOption[];
}

export const QUIZ_STEPS: readonly QuizStepConfig[] = [
  {
    id: "objetivo",
    stepNumber: 1,
    title: "Qual é o seu objetivo principal hoje?",
    subtitle: "Escolha o foco que mais representa o que você busca na sua rotina.",
    options: [
      {
        value: "controle_medidas",
        label: "Controle de medidas e saciedade",
        detail: "Reduzir medidas com mais equilíbrio ao longo do dia",
      },
      {
        value: "energia_disposicao",
        label: "Mais energia e disposição diária",
        detail: "Melhorar ritmo, foco e constância na rotina",
      },
      {
        value: "estetica_recuperacao",
        label: "Estética, pele e recuperação",
        detail: "Cuidar da aparência e do bem-estar com orientação",
      },
      {
        value: "orientacao_completa",
        label: "Quero orientação personalizada",
        detail: "Entender qual linha faz mais sentido para o meu perfil",
      },
    ],
  },
  {
    id: "experiencia",
    stepNumber: 2,
    title: "Qual é a sua experiência com protocolos de rotina?",
    subtitle: "Isso ajuda nossa equipe a adaptar a explicação ao seu momento.",
    options: [
      {
        value: "primeira_vez",
        label: "É a minha primeira vez",
        detail: "Quero entender tudo de forma simples e segura",
      },
      {
        value: "ja_iniciou_antes",
        label: "Já iniciei antes e parei",
        detail: "Busco retomar com um acompanhamento mais claro",
      },
      {
        value: "ja_utiliza",
        label: "Já sigo uma rotina ativa",
        detail: "Quero avaliar opções com procedência e melhor custo-benefício",
      },
      {
        value: "pesquisando_opcoes",
        label: "Estou comparando opções",
        detail: "Quero tirar dúvidas técnicas antes de decidir",
      },
    ],
  },
  {
    id: "desafio",
    stepNumber: 3,
    title: "O que mais pesa na sua decisão hoje?",
    subtitle: "Selecione o ponto que você quer resolver primeiro no atendimento.",
    options: [
      {
        value: "escolher_protocolo",
        label: "Saber qual opção combina comigo",
        detail: "Evitar comprar errado sem orientação",
      },
      {
        value: "procedencia_seguranca",
        label: "Procedência e envio seguro",
        detail: "Ter garantia de origem, acompanhamento e rastreio",
      },
      {
        value: "constancia_rotina",
        label: "Manter constância no dia a dia",
        detail: "Preciso de algo prático para encaixar na agenda",
      },
      {
        value: "condicoes_entrega",
        label: "Prazo de entrega e condições",
        detail: "Quero saber valores, envio e formas de pagamento",
      },
    ],
  },
  {
    id: "momento",
    stepNumber: 4,
    title: "Quando você pretende começar?",
    subtitle: "Última pergunta para liberar seu acesso ao Grupo VIP da Pharmil.",
    options: [
      {
        value: "esta_semana",
        label: "Ainda esta semana",
        detail: "Quero receber as orientações e avançar agora",
      },
      {
        value: "proximos_15_dias",
        label: "Nos próximos 15 dias",
        detail: "Estou me organizando para iniciar em breve",
      },
      {
        value: "este_mes",
        label: "Dentro deste mês",
        detail: "Quero planejar com calma junto à equipe",
      },
      {
        value: "apenas_informacoes",
        label: "Estou só pesquisando informações",
        detail: "Quero conhecer a Pharmil e tirar dúvidas iniciais",
      },
    ],
  },
] as const;

const OBJETIVO_VALUES = [
  "controle_medidas",
  "energia_disposicao",
  "estetica_recuperacao",
  "orientacao_completa",
] as const;
const EXPERIENCIA_VALUES = [
  "primeira_vez",
  "ja_iniciou_antes",
  "ja_utiliza",
  "pesquisando_opcoes",
] as const;
const DESAFIO_VALUES = [
  "escolher_protocolo",
  "procedencia_seguranca",
  "constancia_rotina",
  "condicoes_entrega",
] as const;
const MOMENTO_VALUES = [
  "esta_semana",
  "proximos_15_dias",
  "este_mes",
  "apenas_informacoes",
] as const;

const trackingField = z.string().trim().max(200).optional();

export const quizSubmissionSchema = z.object({
  firstName: z.string().trim().min(2, "Informe seu primeiro nome.").max(80),
  phone: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length >= 10 && v.length <= 13, "Informe seu WhatsApp com DDD."),
  objetivo: z.enum(OBJETIVO_VALUES),
  experiencia: z.enum(EXPERIENCIA_VALUES),
  desafio: z.enum(DESAFIO_VALUES),
  momento: z.enum(MOMENTO_VALUES),
  utm_source: trackingField,
  utm_medium: trackingField,
  utm_campaign: trackingField,
  utm_content: trackingField,
  utm_term: trackingField,
  fbclid: trackingField,
  ttclid: trackingField,
  pageUrl: z.string().trim().max(500).optional(),
});

export type QuizSubmissionInput = z.infer<typeof quizSubmissionSchema>;

export function labelForQuizOption(stepId: QuizStepConfig["id"], value: string): string {
  const step = QUIZ_STEPS.find((item) => item.id === stepId);
  return step?.options.find((opt) => opt.value === value)?.label ?? value;
}

export function resolveOfficialWhatsAppNumber(envValue?: string): string {
  const digits = (envValue ?? DEFAULT_WHATSAPP_NUMBER).replace(/\D/g, "");
  return digits.length >= 12 && digits.length <= 15 ? digits : DEFAULT_WHATSAPP_NUMBER;
}

export function formatBrazilianWhatsAppDisplay(envValue?: string): string {
  const digits = resolveOfficialWhatsAppNumber(envValue);
  const national = digits.startsWith("55") ? digits.slice(2) : digits;
  if (national.length === 11) {
    return `(${national.slice(0, 2)}) ${national.slice(2, 7)}-${national.slice(7)}`;
  }
  if (national.length === 10) {
    return `(${national.slice(0, 2)}) ${national.slice(2, 6)}-${national.slice(6)}`;
  }
  return `+${digits}`;
}

export function resolveVipGroupInviteUrl(envValue?: string): string {
  const trimmed = envValue?.trim();
  if (!trimmed) return DEFAULT_WHATSAPP_VIP_GROUP_URL;
  try {
    const parsed = new URL(trimmed);
    if (
      parsed.protocol === "https:" &&
      parsed.hostname === "chat.whatsapp.com" &&
      parsed.pathname.length > 1
    ) {
      return parsed.toString();
    }
  } catch {
    // Fallback seguro para o link oficial do Grupo VIP.
  }
  return DEFAULT_WHATSAPP_VIP_GROUP_URL;
}

export function buildDirectWhatsAppUrl(officialNumber?: string): string {
  const phone = resolveOfficialWhatsAppNumber(officialNumber);
  return `https://wa.me/${phone}`;
}

export function buildQuizDiagnosticSummary(
  input: Pick<QuizSubmissionInput, "firstName" | "objetivo" | "experiencia" | "desafio" | "momento">,
): string {
  return [
    `Olá, Pharmil. Me chamo ${input.firstName} e concluí a avaliação rápida de rotina:`,
    `- Objetivo: ${labelForQuizOption("objetivo", input.objetivo)}`,
    `- Experiência: ${labelForQuizOption("experiencia", input.experiencia)}`,
    `- Prioridade: ${labelForQuizOption("desafio", input.desafio)}`,
    `- Previsão de início: ${labelForQuizOption("momento", input.momento)}`,
    "Pode me orientar sobre as melhores opções para o meu perfil?",
  ].join("\n");
}

export function buildWhatsAppSummaryUrl(
  input: Pick<QuizSubmissionInput, "firstName" | "objetivo" | "experiencia" | "desafio" | "momento">,
  officialNumber?: string,
): string {
  const phone = resolveOfficialWhatsAppNumber(officialNumber);
  const text = buildQuizDiagnosticSummary(input);
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function priorityTagForMomento(momento: QuizSubmissionInput["momento"]): string {
  if (momento === "esta_semana") return "prioridade-alta";
  if (momento === "proximos_15_dias") return "prioridade-media";
  return "prioridade-pesquisa";
}
