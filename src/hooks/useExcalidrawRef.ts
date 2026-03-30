"use client";

import { useRef, useCallback } from "react";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { captureExcalidrawSvg } from "@/lib/excalidraw-export";

export function useExcalidrawRef() {
  const excalidrawRef = useRef<ExcalidrawImperativeAPI>(null);

  const getSvgSnapshot = useCallback(async (): Promise<string> => {
    if (!excalidrawRef.current) return "";
    try {
      return await captureExcalidrawSvg(excalidrawRef.current);
    } catch {
      return "";
    }
  }, []);

  return { excalidrawRef, getSvgSnapshot };
}
