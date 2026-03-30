"use client";

import { StructuredFeedback, StoredFeedback } from "@/types/feedback";
import { FeedbackSectionCard } from "./FeedbackSection";
import { Loader2, AlertCircle, X, Clock, Trash2 } from "lucide-react";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  feedback: StructuredFeedback | null;
  isLoading: boolean;
  error?: string | null;
  history: StoredFeedback[];
  onSelectHistory: (entry: StoredFeedback) => void;
  onDeleteHistory: (id: string) => void;
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
    <div className="flex items-center justify-between p-6 rounded-xl border border-border bg-muted/30">
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          Overall Score
        </p>
        <p className="text-sm text-muted-foreground">
          Principal Engineer Assessment
        </p>
      </div>
      <div className="text-right">
        <span className={`text-5xl font-semibold tabular-nums ${color}`}>
          {score}
        </span>
        <span className="text-lg text-muted-foreground/50">/10</span>
      </div>
    </div>
  );
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function FeedbackContent({ feedback }: { feedback: StructuredFeedback }) {
  return (
    <div className="space-y-8">
      <OverallScore score={feedback.overallScore} />

      <p className="text-base text-muted-foreground leading-relaxed">
        {feedback.summary}
      </p>

      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Section Breakdown
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {feedback.sections.map((section) => (
            <FeedbackSectionCard key={section.name} section={section} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">
            Strengths
          </p>
          <ul className="space-y-2">
            {feedback.strengths.map((s, i) => (
              <li
                key={i}
                className="text-sm text-muted-foreground flex gap-2"
              >
                <span className="text-emerald-600 dark:text-emerald-500 shrink-0">
                  +
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <p className="text-xs font-medium text-amber-600 dark:text-amber-500 uppercase tracking-wider">
            Improvements
          </p>
          <ul className="space-y-2">
            {feedback.improvements.map((s, i) => (
              <li
                key={i}
                className="text-sm text-muted-foreground flex gap-2"
              >
                <span className="text-amber-600 dark:text-amber-500 shrink-0">
                  -
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Follow-up Questions
        </p>
        <ul className="space-y-2">
          {feedback.followUpQuestions.map((q, i) => (
            <li
              key={i}
              className="text-sm text-muted-foreground p-4 rounded-lg border border-border bg-muted/30"
            >
              <span className="text-muted-foreground/50 mr-2 tabular-nums">
                {i + 1}.
              </span>
              {q}
            </li>
          ))}
        </ul>
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
  history,
  onSelectHistory,
  onDeleteHistory,
}: FeedbackModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <header className="shrink-0 h-14 flex items-center justify-between px-6 border-b border-border">
        <h1 className="text-base font-medium text-foreground">
          Interview Feedback
        </h1>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </header>

      {/* Body */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Sidebar — past feedback */}
        {history.length > 0 && (
          <aside className="w-64 shrink-0 border-r border-border overflow-y-auto">
            <div className="p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                History
              </p>
              <div className="space-y-1">
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    className="group flex items-center gap-1"
                  >
                    <button
                      onClick={() => onSelectHistory(entry)}
                      className="flex-1 text-left px-3 py-2.5 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          {entry.feedback.overallScore}/10
                        </span>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs">
                            {formatDate(entry.timestamp)}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {entry.feedback.summary}
                      </p>
                    </button>
                    <button
                      onClick={() => onDeleteHistory(entry.id)}
                      className="shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-500/10 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-8">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-32 gap-3">
                <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
                <p className="text-muted-foreground text-sm">
                  Analyzing your design...
                </p>
                <p className="text-muted-foreground/50 text-xs">
                  This may take up to 30 seconds
                </p>
              </div>
            )}

            {!isLoading && error && (
              <div className="flex flex-col items-center justify-center py-32 gap-3 text-center">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <p className="text-foreground text-sm">Feedback failed</p>
                <p className="text-muted-foreground text-xs leading-relaxed max-w-sm">
                  {error}
                </p>
              </div>
            )}

            {!isLoading && !error && !feedback && (
              <div className="flex flex-col items-center justify-center py-32 gap-3 text-center">
                <p className="text-muted-foreground text-sm">
                  Select a past feedback from the sidebar, or submit your design
                  for new feedback.
                </p>
              </div>
            )}

            {!isLoading && feedback && <FeedbackContent feedback={feedback} />}
          </div>
        </main>
      </div>
    </div>
  );
}
