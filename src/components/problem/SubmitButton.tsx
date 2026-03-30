"use client";

import { useState, useCallback, useEffect } from "react";
import { useProblemSession } from "@/hooks/useProblemSession";
import { useFeedbackHistory } from "@/hooks/useFeedbackHistory";
import { useFeedbackStream } from "@/hooks/useFeedbackStream";
import { FeedbackModal } from "@/components/feedback/FeedbackModal";
import { StoredFeedback } from "@/types/feedback";
import { Sparkles, History } from "lucide-react";

interface SubmitButtonProps {
  problemSlug: string;
}

export function SubmitButton({ problemSlug }: SubmitButtonProps) {
  const { markdown, getSvgSnapshot, chatMessages } = useProblemSession();
  const { history, save, remove } = useFeedbackHistory(problemSlug);
  const {
    sections,
    feedback,
    isLoading,
    error,
    progress,
    submit,
  } = useFeedbackStream();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [displayFeedback, setDisplayFeedback] = useState(feedback);

  // Sync stream feedback into display
  useEffect(() => {
    if (feedback) {
      setDisplayFeedback(feedback);
    }
  }, [feedback]);

  // Save to history when streaming completes
  useEffect(() => {
    if (feedback) {
      save(feedback);
    }
    // Only run when feedback changes, not on every save reference change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback]);

  const handleSubmit = useCallback(async () => {
    setDisplayFeedback(null);
    setFeedbackOpen(true);

    const svgString = await getSvgSnapshot();
    const chatHistory = chatMessages
      .map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.parts
          .filter((p): p is { type: "text"; text: string } => p.type === "text")
          .map((p) => p.text)
          .join(""),
      }))
      .filter((m) => m.content.trim().length > 0);

    submit({ problemSlug, markdown, svgString, chatHistory });
  }, [getSvgSnapshot, chatMessages, submit, problemSlug, markdown]);

  const handleOpenHistory = useCallback(() => {
    if (history.length > 0) {
      setDisplayFeedback(history[0].feedback);
    } else {
      setDisplayFeedback(null);
    }
    setFeedbackOpen(true);
  }, [history]);

  const handleSelectHistory = useCallback((entry: StoredFeedback) => {
    setDisplayFeedback(entry.feedback);
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
        disabled={isLoading}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        <Sparkles className="w-4 h-4" />
        Get Feedback
      </button>

      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        feedback={displayFeedback}
        isLoading={isLoading}
        error={error}
        history={history}
        onSelectHistory={handleSelectHistory}
        onDeleteHistory={remove}
        streamingSections={sections}
        progress={progress}
      />
    </>
  );
}
