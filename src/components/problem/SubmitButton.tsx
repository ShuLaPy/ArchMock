"use client";

import { useState, useCallback } from "react";
import { useProblemSession } from "@/hooks/useProblemSession";
import { FeedbackModal } from "@/components/feedback/FeedbackModal";
import { StructuredFeedback } from "@/types/feedback";
import { Sparkles } from "lucide-react";

interface SubmitButtonProps {
  problemSlug: string;
}

export function SubmitButton({ problemSlug }: SubmitButtonProps) {
  const { markdown, getSvgSnapshot } = useProblemSession();
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
  }, [getSvgSnapshot, markdown, problemSlug, saveSvgFile]);

  return (
    <>
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
      />
    </>
  );
}
