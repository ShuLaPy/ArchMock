"use client";

import Link from "next/link";
import { Problem } from "@/types/problem";
import { ArrowUpRight, Clock } from "lucide-react";

const difficultyLabel: Record<Problem["difficulty"], string> = {
  Easy: "text-emerald-500",
  Medium: "text-amber-500",
  Hard: "text-red-400",
};

export function ProblemCard({ problem }: { problem: Problem }) {
  return (
    <Link href={`/problem/${problem.slug}`} className="group block">
      <div className="h-full rounded-xl border border-border bg-card p-6 transition-colors duration-150 hover:border-ring hover:bg-accent/50">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-medium text-card-foreground group-hover:text-foreground transition-colors">
              {problem.title}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span
            className={`text-xs font-medium ${difficultyLabel[problem.difficulty]}`}
          >
            {problem.difficulty}
          </span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-2">
          {problem.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {problem.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>{problem.estimatedMinutes}m</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
