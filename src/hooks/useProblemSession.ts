"use client";

import { createContext, useContext, type SetStateAction, type Dispatch } from "react";
import type { RefObject } from "react";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import type { UIMessage } from "ai";

export interface ProblemSessionContext {
  markdown: string;
  setMarkdown: Dispatch<SetStateAction<string>>;
  excalidrawRef: RefObject<ExcalidrawImperativeAPI | null>;
  getSvgSnapshot: () => Promise<string>;
  chatMessages: UIMessage[];
  setChatMessages: Dispatch<SetStateAction<UIMessage[]>>;
}

export const ProblemSessionContext = createContext<ProblemSessionContext | null>(
  null
);

export function useProblemSession(): ProblemSessionContext {
  const ctx = useContext(ProblemSessionContext);
  if (!ctx) {
    throw new Error("useProblemSession must be used within ProblemSessionProvider");
  }
  return ctx;
}
