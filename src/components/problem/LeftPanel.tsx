"use client";

import { Problem } from "@/types/problem";
import { ChatInterface } from "./ChatInterface";

const difficultyColor: Record<Problem["difficulty"], string> = {
  Easy: "text-emerald-500",
  Medium: "text-amber-500",
  Hard: "text-red-400",
};

export function LeftPanel({ problem }: { problem: Problem }) {
  return (
    <div className="flex flex-col h-full bg-background">
      <div
        className="shrink-0 border-b border-border overflow-y-auto"
        style={{ maxHeight: "18rem" }}
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-foreground">
              {problem.title}
            </h2>
            <span
              className={`text-xs font-medium ${difficultyColor[problem.difficulty]}`}
            >
              {problem.difficulty}
            </span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {problem.description}
          </p>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Functional
            </p>
            <ul className="space-y-1">
              {problem.requirements.functional.map((req, i) => (
                <li key={i} className="text-sm text-foreground/70 flex gap-2">
                  <span className="text-muted-foreground shrink-0">-</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Non-Functional
            </p>
            <ul className="space-y-1">
              {problem.requirements.nonFunctional.map((req, i) => (
                <li key={i} className="text-sm text-foreground/70 flex gap-2">
                  <span className="text-muted-foreground shrink-0">-</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ChatInterface problem={problem} />
      </div>
    </div>
  );
}
