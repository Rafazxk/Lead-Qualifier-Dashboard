import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Users, TrendingUp } from "lucide-react";
import { type Lead, TAG_LABELS, TAG_COLORS } from "@/lib/qualification";
import { ScoreStars } from "./ScoreStars";

interface LeadsTableProps {
  leads: Lead[];
  onClear: () => void;
}

type SortKey = "score" | "budget" | "submittedAt";

function formatBudget(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function LeadsTable({ leads, onClear }: LeadsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("submittedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = [...leads].sort((a, b) => {
    let aVal: number, bVal: number;
    if (sortKey === "score") {
      aVal = a.score;
      bVal = b.score;
    } else if (sortKey === "budget") {
      aVal = a.budget;
      bVal = b.budget;
    } else {
      aVal = a.submittedAt.getTime();
      bVal = b.submittedAt.getTime();
    }
    return sortDir === "asc" ? aVal - bVal : bVal - aVal;
  });

  const avgScore =
    leads.length > 0
      ? (leads.reduce((s, l) => s + l.score, 0) / leads.length).toFixed(1)
      : "—";

  const highQuality = leads.filter((l) => l.score >= 4).length;

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-3 text-center px-6">
        <div className="w-12 h-12 rounded-xl bg-zinc-800/60 flex items-center justify-center">
          <Users size={20} className="text-zinc-600" />
        </div>
        <p className="text-sm text-zinc-500">Nenhum lead qualificado ainda.</p>
        <p className="text-xs text-zinc-600">
          Preencha o formulário para começar a analisar.
        </p>
      </div>
    );
  }

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col)
      return <ChevronDown size={12} className="text-zinc-700" />;
    return sortDir === "asc" ? (
      <ChevronUp size={12} className="text-zinc-400" />
    ) : (
      <ChevronDown size={12} className="text-zinc-400" />
    );
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-3">
          <p className="text-xs text-zinc-500 mb-1">Score médio</p>
          <p className="text-xl font-bold text-zinc-100">
            {avgScore}
            <span className="text-xs text-zinc-500 font-normal"> /5</span>
          </p>
        </div>
        <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-3">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp size={10} className="text-emerald-400" />
            <p className="text-xs text-zinc-500">Qualificados</p>
          </div>
          <p className="text-xl font-bold text-emerald-400">
            {highQuality}
            <span className="text-xs text-zinc-500 font-normal"> leads</span>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-500">
          {leads.length} {leads.length === 1 ? "lead" : "leads"} capturado{leads.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-xs text-zinc-600 hover:text-red-400 transition-colors"
        >
          <Trash2 size={12} />
          Limpar
        </button>
      </div>

      <div className="flex-1 overflow-auto rounded-lg border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/80">
              <th className="text-left px-3 py-2.5 text-xs font-medium text-zinc-500">
                Lead
              </th>
              <th
                className="text-left px-3 py-2.5 text-xs font-medium text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors"
                onClick={() => handleSort("score")}
              >
                <span className="flex items-center gap-1">
                  Score <SortIcon col="score" />
                </span>
              </th>
              <th
                className="text-left px-3 py-2.5 text-xs font-medium text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors hidden sm:table-cell"
                onClick={() => handleSort("budget")}
              >
                <span className="flex items-center gap-1">
                  Orçamento <SortIcon col="budget" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {sorted.map((lead) => (
              <>
                <tr
                  key={lead.id}
                  onClick={() =>
                    setExpanded(expanded === lead.id ? null : lead.id)
                  }
                  className="cursor-pointer hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-3 py-3">
                    <div>
                      <p className="text-zinc-200 font-medium text-xs truncate max-w-[120px]">
                        {lead.name}
                      </p>
                      <p className="text-zinc-600 text-xs truncate max-w-[120px]">
                        {lead.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-col gap-1">
                      <ScoreStars score={lead.score} size="sm" />
                      <span
                        className={`inline-flex text-xs px-1.5 py-0.5 rounded border ${TAG_COLORS[lead.tag]} font-medium leading-none w-fit`}
                      >
                        {TAG_LABELS[lead.tag]}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 hidden sm:table-cell">
                    <div>
                      <p className="text-zinc-300 text-xs font-medium">
                        {formatBudget(lead.budget)}
                      </p>
                      <p className="text-zinc-600 text-xs">
                        {formatTime(lead.submittedAt)}
                      </p>
                    </div>
                  </td>
                </tr>
                {expanded === lead.id && (
                  <tr key={`${lead.id}-expanded`} className="bg-zinc-900/40">
                    <td colSpan={3} className="px-3 py-3">
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-zinc-400">
                          Feedback da IA:
                        </p>
                        <p className="text-xs text-zinc-300 leading-relaxed">
                          {lead.feedback}
                        </p>
                        <div className="h-px bg-zinc-800 my-2" />
                        <p className="text-xs font-medium text-zinc-400">
                          Descrição:
                        </p>
                        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-4">
                          {lead.description}
                        </p>
                        <p className="text-xs text-zinc-600 mt-1">
                          Orçamento:{" "}
                          <span className="text-zinc-400 font-medium">
                            {formatBudget(lead.budget)}
                          </span>
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
