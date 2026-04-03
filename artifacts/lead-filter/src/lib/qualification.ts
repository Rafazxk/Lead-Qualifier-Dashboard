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
  | "hot_lead"
  | "highly_qualified"
  | "needs_review"
  | "curious"
  | "low_potential";

interface QualificationResult {
  score: number;
  feedback: string;
  tag: LeadTag;
}

const URGENT_KEYWORDS = [
  "urgente",
  "agora",
  "prazo curto",
  "imediatamente",
  "ontem",
  "urgent",
  "immediately",
  "asap",
  "right now",
];

function containsUrgency(text: string): boolean {
  const lower = text.toLowerCase();
  return URGENT_KEYWORDS.some((kw) => lower.includes(kw));
}

export function qualifyLead(
  budget: number,
  description: string
): QualificationResult {
  const desc = description.trim();

  // RULE 3 — Filtro de qualidade: orçamento baixo + descrição curta → fixar em 1
  if (budget < 1000 && desc.length < 20) {
    return {
      score: 1,
      feedback: "Lead com baixo engajamento e orçamento reduzido.",
      tag: "low_potential",
    };
  }

  // RULE 1 — Score base pelo orçamento
  let score: number;
  if (budget > 5000) {
    score = 3;
  } else if (budget >= 1000) {
    score = 2;
  } else {
    score = 1;
  }

  // RULE 2 — Bônus de urgência: +2 e tag Hot Lead
  const isUrgent = containsUrgency(desc);
  if (isUrgent) {
    score = Math.min(5, score + 2);
    return {
      score,
      feedback: "Contato urgente detectado. Acione o time de vendas agora.",
      tag: "hot_lead",
    };
  }

  // Mapeamento de score para feedback e tag
  let feedback: string;
  let tag: LeadTag;

  if (score >= 4) {
    feedback = "Lead altamente qualificado. Alto potencial de conversão.";
    tag = "highly_qualified";
  } else if (score === 3) {
    feedback = "Lead promissor. Vale agendar uma call de discovery.";
    tag = "needs_review";
  } else if (score === 2) {
    feedback = "Lead curioso, ainda explorando opções.";
    tag = "curious";
  } else {
    feedback = "Lead fora do perfil ideal por ora.";
    tag = "low_potential";
  }

  return { score, feedback, tag };
}

export const TAG_LABELS: Record<LeadTag, string> = {
  hot_lead: "Prioridade Máxima (Hot Lead)",
  highly_qualified: "Altamente qualificado",
  needs_review: "Requer análise",
  curious: "Lead curioso",
  low_potential: "Curioso / Baixo Potencial",
};

export const TAG_COLORS: Record<LeadTag, string> = {
  hot_lead: "text-red-400 bg-red-500/10 border-red-500/25",
  highly_qualified: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
  needs_review: "text-amber-400 bg-amber-500/10 border-amber-500/25",
  curious: "text-sky-400 bg-sky-500/10 border-sky-500/25",
  low_potential: "text-zinc-400 bg-zinc-500/10 border-zinc-500/25",
};

export const TAG_DOT_COLORS: Record<LeadTag, string> = {
  hot_lead: "bg-red-500",
  highly_qualified: "bg-emerald-500",
  needs_review: "bg-amber-500",
  curious: "bg-sky-500",
  low_potential: "bg-zinc-500",
};

export function scoreProgressColor(score: number): string {
  if (score >= 4) return "bg-emerald-500";
  if (score === 3) return "bg-amber-500";
  return "bg-zinc-500";
}

export function scoreProgressTrackColor(score: number): string {
  if (score >= 4) return "bg-emerald-500/15";
  if (score === 3) return "bg-amber-500/15";
  return "bg-zinc-500/15";
}
