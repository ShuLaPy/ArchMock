"use client";

import { useCallback, useState, useEffect } from "react";
import { StructuredFeedback, StoredFeedback } from "@/types/feedback";

function getStorageKey(problemSlug: string) {
  return `feedback-history:${problemSlug}`;
}

export function useFeedbackHistory(problemSlug: string) {
  const [history, setHistory] = useState<StoredFeedback[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(getStorageKey(problemSlug));
      if (raw) setHistory(JSON.parse(raw));
    } catch {
      // ignore corrupt data
    }
  }, [problemSlug]);

  const save = useCallback(
    (feedback: StructuredFeedback) => {
      const entry: StoredFeedback = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        feedback,
        timestamp: Date.now(),
      };
      setHistory((prev) => {
        const next = [entry, ...prev];
        localStorage.setItem(getStorageKey(problemSlug), JSON.stringify(next));
        return next;
      });
      return entry;
    },
    [problemSlug]
  );

  const remove = useCallback(
    (id: string) => {
      setHistory((prev) => {
        const next = prev.filter((e) => e.id !== id);
        localStorage.setItem(getStorageKey(problemSlug), JSON.stringify(next));
        return next;
      });
    },
    [problemSlug]
  );

  return { history, save, remove };
}
