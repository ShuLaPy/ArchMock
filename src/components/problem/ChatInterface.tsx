"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import { Problem } from "@/types/problem";
import { useProblemSession } from "@/hooks/useProblemSession";
import { ArrowUp, Loader2 } from "lucide-react";

interface ChatInterfaceProps {
  problem: Problem;
}

export function ChatInterface({ problem }: ChatInterfaceProps) {
  const { markdown, getSvgSnapshot, setChatMessages } = useProblemSession();
  const [inputValue, setInputValue] = useState("");
  const markdownRef = useRef(markdown);
  markdownRef.current = markdown;
  const svgSnapshotRef = useRef<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(
    () =>
      new TextStreamChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ messages }) => ({
          body: {
            messages,
            problemSlug: problem.slug,
            markdownContext: markdownRef.current,
            svgContext: svgSnapshotRef.current,
          },
        }),
      }),
    [problem.slug]
  );

  const { sendMessage, messages, status } = useChat({ transport });
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    setChatMessages(messages);
  }, [messages, setChatMessages]);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputValue.trim() || isLoading) return;
      svgSnapshotRef.current = await getSvgSnapshot();
      const text = inputValue;
      setInputValue("");
      await sendMessage({ text });
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    [inputValue, isLoading, getSvgSnapshot, sendMessage]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3">
        {messages.length === 0 && (
          <div className="mb-4">
            <div className="rounded-lg bg-muted/50 border border-border px-3.5 py-2.5 text-sm text-muted-foreground leading-relaxed">
              I&apos;m your interviewer for{" "}
              <span className="text-foreground">{problem.title}</span>.
              Let&apos;s start — what&apos;s the first thing you&apos;d want to
              clarify before designing this system?
            </div>
          </div>
        )}

        <div className="space-y-3">
          {messages.map((msg) => {
            const textContent = msg.parts
              .filter((p) => p.type === "text")
              .map((p) => ("text" in p ? p.text : ""))
              .join("");
            return (
              <div
                key={msg.id}
                className={
                  msg.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <div
                  className={`max-w-[88%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 border border-border text-muted-foreground"
                  }`}
                >
                  {textContent}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted/50 border border-border rounded-lg px-3.5 py-2.5">
                <Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="flex gap-2 p-3 border-t border-border"
      >
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask the interviewer..."
          disabled={isLoading}
          className="flex-1 bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring disabled:opacity-50 transition-colors"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
