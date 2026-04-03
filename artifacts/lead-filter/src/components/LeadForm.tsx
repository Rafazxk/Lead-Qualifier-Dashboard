import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Send, User, Mail, DollarSign, FileText } from "lucide-react";
import { qualifyLead, type Lead } from "@/lib/qualification";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  budget: z
    .string()
    .min(1, "Informe o orçamento")
    .refine((v) => !isNaN(Number(v.replace(/\D/g, ""))) && Number(v.replace(/\D/g, "")) > 0, {
      message: "Informe um valor válido",
    }),
  description: z
    .string()
    .min(10, "Descreva o projeto com pelo menos 10 caracteres")
    .max(1000, "Máximo 1000 caracteres"),
});

type FormValues = z.infer<typeof formSchema>;

interface LeadFormProps {
  onLeadSubmitted: (lead: Lead) => void;
}

function formatCurrency(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  const number = parseInt(digits, 10);
  return number.toLocaleString("pt-BR");
}

export function LeadForm({ onLeadSubmitted }: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [budgetDisplay, setBudgetDisplay] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const description = watch("description") || "";

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const formatted = raw ? formatCurrency(e.target.value) : "";
    setBudgetDisplay(formatted);
    setValue("budget", raw, { shouldValidate: true });
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    await new Promise((r) => setTimeout(r, 600));

    const budgetValue = parseInt(data.budget.replace(/\D/g, ""), 10);
    const { score, feedback, tag } = qualifyLead(budgetValue, data.description);

    const lead: Lead = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      budget: budgetValue,
      description: data.description,
      score,
      feedback,
      tag,
      submittedAt: new Date(),
    };

    onLeadSubmitted(lead);
    reset();
    setBudgetDisplay("");
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 uppercase tracking-widest">
          <User size={12} className="text-zinc-500" />
          Nome completo
        </label>
        <input
          {...register("name")}
          placeholder="Ex: João Silva"
          className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all"
        />
        {errors.name && (
          <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 uppercase tracking-widest">
          <Mail size={12} className="text-zinc-500" />
          E-mail
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="Ex: joao@empresa.com"
          className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all"
        />
        {errors.email && (
          <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 uppercase tracking-widest">
          <DollarSign size={12} className="text-zinc-500" />
          Orçamento estimado (R$)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-medium">
            R$
          </span>
          <input
            value={budgetDisplay}
            onChange={handleBudgetChange}
            placeholder="0"
            className="w-full rounded-lg bg-zinc-900 border border-zinc-800 pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all"
          />
          <input type="hidden" {...register("budget")} />
        </div>
        {errors.budget && (
          <p className="text-xs text-red-400 mt-1">{errors.budget.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 uppercase tracking-widest">
            <FileText size={12} className="text-zinc-500" />
            Descrição do projeto
          </span>
          <span className="text-xs text-zinc-600">
            {description.length}/1000
          </span>
        </label>
        <textarea
          {...register("description")}
          placeholder="Descreva o que você precisa, prazo, objetivos, tecnologias..."
          rows={5}
          className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all resize-none leading-relaxed"
        />
        {errors.description && (
          <p className="text-xs text-red-400 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 shadow-lg shadow-violet-900/30"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Analisando lead...
          </>
        ) : (
          <>
            <Send size={16} />
            Qualificar Lead
          </>
        )}
      </button>
    </form>
  );
}
