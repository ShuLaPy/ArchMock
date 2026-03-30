"use client";

import { useState, useCallback, useRef } from "react";
import type {
  FeedbackSection,
  FeedbackStreamEvent,
  StructuredFeedback,
} from "@/types/feedback";

const TOTAL_SECTIONS = 8;

export function useFeedbackStream() {
  const [sections, setSections] = useState<FeedbackSection[]>([]);
  const [feedback, setFeedback] = useState<StructuredFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    setSections([]);
    setFeedback(null);
    setError(null);
    setProgress(0);
  }, []);

  const submit = useCallback(
    async (body: {
      problemSlug: string;
      markdown: string;
      svgString: string;
      chatHistory: { role: string; content: string }[];
    }) => {
      reset();
      setIsLoading(true);

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      let sectionCount = 0;

      try {
        const res = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "Unknown error");
          throw new Error(`Server error ${res.status}: ${text}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response stream");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            let event: FeedbackStreamEvent;
            try {
              event = JSON.parse(trimmed);
            } catch {
              continue;
            }

            switch (event.type) {
              case "section_complete":
                sectionCount++;
                setSections((prev) => [...prev, event.section]);
                setProgress(sectionCount / (TOTAL_SECTIONS + 4)); // 8 sections + 4 remaining steps
                break;

              case "cross_reference":
              case "diagram_analysis":
                setProgress((sectionCount + 1) / (TOTAL_SECTIONS + 4));
                break;

              case "calibration":
                setProgress((sectionCount + 2) / (TOTAL_SECTIONS + 4));
                break;

              case "follow_up":
                setProgress((sectionCount + 3) / (TOTAL_SECTIONS + 4));
                break;

              case "complete":
                setFeedback(event.feedback);
                setProgress(1);
                break;

              case "error":
                setError(event.message);
                break;
            }
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong. Check the console for details."
          );
        }
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [reset]
  );

  return { sections, feedback, isLoading, error, progress, submit, reset };
}
