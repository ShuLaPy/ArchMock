"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { StructuredFeedback } from "@/types/feedback";
import { FeedbackSectionCard } from "./FeedbackSection";
import { Loader2, AlertCircle } from "lucide-react";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  feedback: StructuredFeedback | null;
  isLoading: boolean;
  error?: string | null;
}

function OverallScore({ score }: { score: number }) {
  const color =
    score >= 8
      ? "text-emerald-400"
      : score >= 6
      ? "text-amber-400"
      : score >= 4
      ? "text-orange-400"
      : "text-red-400";

  return (
    <div className="flex items-center justify-between p-5 rounded-lg border border-border bg-muted/30">
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          Overall Score
        </p>
        <p className="text-sm text-muted-foreground">
          Principal Engineer Assessment
        </p>
      </div>
      <div className="text-right">
        <span className={`text-4xl font-semibold tabular-nums ${color}`}>
          {score}
        </span>
        <span className="text-base text-muted-foreground/50">/10</span>
      </div>
    </div>
  );
}

export function FeedbackModal({
  open,
  onClose,
  feedback,
  isLoading,
  error,
}: FeedbackModalProps) {
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg bg-background border-border p-0 flex flex-col h-full"
      >
        <SheetHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle className="text-foreground text-base font-medium">
            Interview Feedback
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="px-6 py-5 space-y-6">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                <p className="text-muted-foreground text-sm">
                  Analyzing your design...
                </p>
                <p className="text-muted-foreground/50 text-xs">
                  This may take up to 30 seconds
                </p>
              </div>
            )}

            {!isLoading && error && (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-foreground text-sm">Feedback failed</p>
                <p className="text-muted-foreground text-xs leading-relaxed max-w-sm">
                  {error}
                </p>
              </div>
            )}

            {!isLoading && feedback && (
              <>
                <OverallScore score={feedback.overallScore} />

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feedback.summary}
                </p>

                <div className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Section Breakdown
                  </p>
                  {feedback.sections.map((section) => (
                    <FeedbackSectionCard
                      key={section.name}
                      section={section}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">
                      Strengths
                    </p>
                    <ul className="space-y-1.5">
                      {feedback.strengths.map((s, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground flex gap-2"
                        >
                          <span className="text-emerald-600 dark:text-emerald-500 shrink-0">+</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-amber-600 dark:text-amber-500 uppercase tracking-wider">
                      Improvements
                    </p>
                    <ul className="space-y-1.5">
                      {feedback.improvements.map((s, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground flex gap-2"
                        >
                          <span className="text-amber-600 dark:text-amber-500 shrink-0">-</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Follow-up Questions
                  </p>
                  <ul className="space-y-2">
                    {feedback.followUpQuestions.map((q, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground p-3 rounded-lg border border-border bg-muted/30"
                      >
                        <span className="text-muted-foreground/50 mr-2 tabular-nums">
                          {i + 1}.
                        </span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
