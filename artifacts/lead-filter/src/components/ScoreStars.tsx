import { Star } from "lucide-react";
import { SCORE_COLORS } from "@/lib/qualification";

interface ScoreStarsProps {
  score: number;
  size?: "sm" | "md";
}

export function ScoreStars({ score, size = "md" }: ScoreStarsProps) {
  const iconSize = size === "sm" ? 12 : 14;
  const colorClass = SCORE_COLORS[score] ?? "text-zinc-400";

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={iconSize}
          className={
            i < score
              ? `${colorClass} fill-current`
              : "text-zinc-700"
          }
        />
      ))}
    </div>
  );
}
