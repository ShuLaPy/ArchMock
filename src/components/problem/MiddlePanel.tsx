"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState, useEffect } from "react";
import { useProblemSession } from "@/hooks/useProblemSession";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import {
  parseMarkdownSections,
  insertIntoSection,
} from "@/lib/markdown-sections";
import { Mic, MicOff, ChevronDown } from "lucide-react";
import type { MDXEditorMethods } from "@mdxeditor/editor";

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
  const editorRef = useRef<MDXEditorMethods | null>(null);
  const [selectedSection, setSelectedSection] = useState("");
  const [sections, setSections] = useState<{ label: string }[]>([]);

  // Parse sections from initial markdown and whenever editor mounts
  useEffect(() => {
    const parsed = parseMarkdownSections(markdown);
    setSections(parsed);
    if (parsed.length > 0 && !selectedSection) {
      setSelectedSection(parsed[0].label);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTranscript = useCallback(
    (text: string) => {
      // Get fresh markdown from editor (source of truth)
      const currentMd = editorRef.current?.getMarkdown() ?? markdown;
      const updated = insertIntoSection(currentMd, selectedSection, text);
      editorRef.current?.setMarkdown(updated);
      setMarkdown(updated);

      // Re-parse sections in case structure changed
      const parsed = parseMarkdownSections(updated);
      setSections(parsed);
    },
    [markdown, selectedSection, setMarkdown]
  );

  const { isListening, isSupported, toggle } = useSpeechToText({
    onTranscript: handleTranscript,
  });

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden min-h-0">
      {isSupported && (
        <div className="shrink-0 flex items-center justify-between gap-2 px-4 py-2 border-b border-border">
          <div className="flex items-center gap-2 min-w-0">
            {isListening && (
              <span className="flex items-center gap-1.5 text-xs text-red-500 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Listening
              </span>
            )}
            {isListening && sections.length > 0 && (
              <div className="relative min-w-0">
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="appearance-none bg-muted text-foreground text-xs rounded-md pl-2 pr-6 py-1 border border-border focus:outline-none focus:border-ring truncate cursor-pointer"
                >
                  {sections.map((s) => (
                    <option key={s.label} value={s.label}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
              </div>
            )}
          </div>
          <button
            onClick={toggle}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
              isListening
                ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
            title={isListening ? "Stop dictation" : "Start dictation"}
          >
            {isListening ? (
              <MicOff className="w-3.5 h-3.5" />
            ) : (
              <Mic className="w-3.5 h-3.5" />
            )}
            {isListening ? "Stop" : "Dictate"}
          </button>
        </div>
      )}
      <div className="flex-1 min-h-0">
        <MarkdownEditor
          editorRef={editorRef}
          value={markdown}
          onChange={setMarkdown}
        />
      </div>
    </div>
  );
}
