"use client";

import dynamic from "next/dynamic";
import { useProblemSession } from "@/hooks/useProblemSession";

const MarkdownEditor = dynamic(
  () => import("@/components/editor/MarkdownEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-background">
        <div className="text-muted-foreground text-sm">Loading editor...</div>
      </div>
    ),
  }
);

export function MiddlePanel() {
  const { markdown, setMarkdown } = useProblemSession();

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden min-h-0">
      <MarkdownEditor value={markdown} onChange={setMarkdown} />
    </div>
  );
}
