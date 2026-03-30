"use client";

import { useState, useCallback } from "react";
import { useProblemSession } from "@/hooks/useProblemSession";
import { useFeedbackHistory } from "@/hooks/useFeedbackHistory";
import { FeedbackModal } from "@/components/feedback/FeedbackModal";
import { StructuredFeedback, StoredFeedback } from "@/types/feedback";
import { Sparkles, History } from "lucide-react";

interface SubmitButtonProps {
  problemSlug: string;
}

export function SubmitButton({ problemSlug }: SubmitButtonProps) {
  const { markdown, getSvgSnapshot } = useProblemSession();
  const { history, save, remove } = useFeedbackHistory(problemSlug);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState<StructuredFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveSvgFile = useCallback(
    (svgString: string) => {
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${problemSlug}-${Date.now()}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [problemSlug]
  );

  const handleSubmit = useCallback(async () => {
    setFeedback(null);
    setError(null);
    setFeedbackOpen(true);
    setIsLoading(true);

    try {
      const svgString = await getSvgSnapshot();
      saveSvgFile(svgString);
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemSlug, markdown, svgString }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "Unknown error");
        throw new Error(`Server error ${res.status}: ${text}`);
      }

      const data: StructuredFeedback = await res.json();
      save(data);
      setFeedback(data);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Check the console for details."
      );
    } finally {
      setIsLoading(false);
    }
  }, [getSvgSnapshot, markdown, problemSlug, saveSvgFile, save]);

  const handleOpenHistory = useCallback(() => {
    setError(null);
    setIsLoading(false);
    if (history.length > 0) {
      setFeedback(history[0].feedback);
    } else {
      setFeedback(null);
    }
    setFeedbackOpen(true);
  }, [history]);

  const handleSelectHistory = useCallback((entry: StoredFeedback) => {
    setError(null);
    setIsLoading(false);
    setFeedback(entry.feedback);
  }, []);

  return (
    <>
      {history.length > 0 && (
        <button
          onClick={handleOpenHistory}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          title="View past feedback"
        >
          <History className="w-4 h-4" />
          History
        </button>
      )}

      <button
        onClick={handleSubmit}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        <Sparkles className="w-4 h-4" />
        Get Feedback
      </button>

      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        feedback={feedback}
        isLoading={isLoading}
        error={error}
        history={history}
        onSelectHistory={handleSelectHistory}
        onDeleteHistory={remove}
      />
    </>
  );
}
