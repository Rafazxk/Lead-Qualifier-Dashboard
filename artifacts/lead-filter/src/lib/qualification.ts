export interface Lead {
  id: string;
  name: string;
  email: string;
  budget: number;
  description: string;
  score: number;
  feedback: string;
  tag: LeadTag;
  submittedAt: Date;
}

export type LeadTag =
  | "highly_qualified"
  | "curious"
  | "urgent_return"
  | "low_budget"
  | "needs_review";

interface QualificationResult {
  score: number;
  feedback: string;
  tag: LeadTag;
}

const HIGH_BUDGET_THRESHOLD = 10000;
const MID_BUDGET_THRESHOLD = 3000;
const LOW_BUDGET_THRESHOLD = 500;

const URGENT_KEYWORDS = [
  "urgente",
  "urgent",
  "imediato",
  "immediate",
  "prazo",
  "deadline",
  "hoje",
  "amanhã",
  "semana",
  "rápido",
  "logo",
  "asap",
  "quickly",
];

const HIGH_VALUE_KEYWORDS = [
  "e-commerce",
  "ecommerce",
  "plataforma",
  "platform",
  "sistema",
  "system",
  "aplicativo",
  "app",
  "saas",
  "crm",
  "erp",
  "integração",
  "integration",
  "api",
  "dashboard",
  "automação",
  "automation",
  "escala",
  "scale",
  "lançamento",
  "launch",
];

const LOW_QUALITY_KEYWORDS = [
  "barato",
  "cheap",
  "simples",
  "simple",
  "básico",
  "basic",
  "landing page",
  "landing",
  "blog",
  "portfólio",
  "portfolio",
  "informativo",
  "informational",
];

function containsKeywords(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

function countKeywordMatches(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.filter((kw) => lower.includes(kw)).length;
}

export function qualifyLead(
  budget: number,
  description: string
): QualificationResult {
  let score = 0;
  const desc = description.trim();

  if (budget >= HIGH_BUDGET_THRESHOLD) {
    score += 3;
  } else if (budget >= MID_BUDGET_THRESHOLD) {
    score += 2;
  } else if (budget >= LOW_BUDGET_THRESHOLD) {
    score += 1;
  }

  const highMatches = countKeywordMatches(desc, HIGH_VALUE_KEYWORDS);
  score += Math.min(highMatches, 2);

  const lowMatches = countKeywordMatches(desc, LOW_QUALITY_KEYWORDS);
  score -= Math.min(lowMatches, 1);

  const descLength = desc.split(/\s+/).filter(Boolean).length;
  if (descLength >= 50) {
    score += 1;
  } else if (descLength >= 20) {
    score += 0;
  } else if (descLength < 5) {
    score -= 1;
  }

  const isUrgent = containsKeywords(desc, URGENT_KEYWORDS);
  if (isUrgent) {
    score += 1;
  }

  score = Math.max(1, Math.min(5, score));

  let feedback: string;
  let tag: LeadTag;

  if (isUrgent && score >= 3) {
    feedback = "Precisa de retorno urgente";
    tag = "urgent_return";
  } else if (score >= 5) {
    feedback = "Lead altamente qualificado";
    tag = "highly_qualified";
  } else if (score === 4) {
    feedback = "Lead com alto potencial";
    tag = "highly_qualified";
  } else if (score === 3) {
    feedback = "Lead promissor, vale acompanhar";
    tag = "needs_review";
  } else if (score === 2) {
    feedback = "Lead curioso, ainda explorando";
    tag = "curious";
  } else {
    feedback = "Lead fora do perfil ideal";
    tag = "low_budget";
  }

  return { score, feedback, tag };
}

export const TAG_LABELS: Record<LeadTag, string> = {
  highly_qualified: "Altamente qualificado",
  curious: "Lead curioso",
  urgent_return: "Retorno urgente",
  low_budget: "Orçamento baixo",
  needs_review: "Requer análise",
};

export const TAG_COLORS: Record<LeadTag, string> = {
  highly_qualified: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  curious: "text-sky-400 bg-sky-400/10 border-sky-400/20",
  urgent_return: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  low_budget: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
  needs_review: "text-violet-400 bg-violet-400/10 border-violet-400/20",
};

export const SCORE_COLORS: Record<number, string> = {
  1: "text-zinc-400",
  2: "text-sky-400",
  3: "text-violet-400",
  4: "text-amber-400",
  5: "text-emerald-400",
};
