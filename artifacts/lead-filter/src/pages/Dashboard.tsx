import { useState } from "react";
import { Shield, Zap, Menu, X } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";
import { LeadsTable } from "@/components/LeadsTable";
import { type Lead } from "@/lib/qualification";

export function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLeadSubmitted = (lead: Lead) => {
    setLeads((prev) => [lead, ...prev]);
    setSidebarOpen(true);
  };

  const handleClear = () => {
    setLeads([]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header className="border-b border-zinc-800/60 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
            <Shield size={16} className="text-violet-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-zinc-100 tracking-tight">
              LeadFilter
            </h1>
            <p className="text-xs text-zinc-500 hidden sm:block">
              Qualificação inteligente de leads
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1">
            <Zap size={11} className="fill-current" />
            IA ativa
          </div>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="sm:hidden text-zinc-400 hover:text-zinc-200 transition-colors relative"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            {leads.length > 0 && !sidebarOpen && (
              <span className="absolute -top-1 -right-1 w-4 h-4 text-xs bg-violet-600 text-white rounded-full flex items-center justify-center font-bold">
                {leads.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main
          className={`${
            sidebarOpen ? "hidden sm:flex" : "flex"
          } flex-col flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto`}
        >
          <div className="max-w-xl w-full mx-auto">
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs text-violet-400 bg-violet-400/10 border border-violet-400/20 rounded-full px-3 py-1 mb-3">
                <Zap size={10} className="fill-current" />
                Qualificação por IA
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-2">
                Novo lead
              </h2>
              <p className="text-sm text-zinc-500">
                Preencha os dados do lead para receber uma análise de prioridade
                e score automático.
              </p>
            </div>

            <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5 sm:p-6 shadow-2xl shadow-black/40">
              <LeadForm onLeadSubmitted={handleLeadSubmitted} />
            </div>

            <div className="mt-4 rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-4">
              <p className="text-xs text-zinc-500 font-medium mb-2 uppercase tracking-widest">
                Como o score funciona
              </p>
              <div className="space-y-1.5 text-xs text-zinc-500">
                <div className="flex items-start gap-2">
                  <span className="text-violet-400 shrink-0 mt-0.5">▪</span>
                  <span>Orçamento alto aumenta a pontuação base.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-violet-400 shrink-0 mt-0.5">▪</span>
                  <span>
                    Palavras-chave de projetos complexos (API, SaaS, plataforma)
                    elevam o score.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-violet-400 shrink-0 mt-0.5">▪</span>
                  <span>
                    Urgência detectada na descrição marca o lead como prioridade.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-violet-400 shrink-0 mt-0.5">▪</span>
                  <span>
                    Descrições detalhadas demonstram maturidade do projeto.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>

        <aside
          className={`${
            sidebarOpen ? "flex" : "hidden sm:flex"
          } flex-col w-full sm:w-80 lg:w-96 border-l border-zinc-800/60 bg-zinc-950 p-4 sm:p-5 overflow-y-auto shrink-0`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-300">
              Leads qualificados
            </h3>
            <button
              onClick={() => setSidebarOpen(false)}
              className="sm:hidden text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <LeadsTable leads={leads} onClear={handleClear} />
        </aside>
      </div>
    </div>
  );
}
