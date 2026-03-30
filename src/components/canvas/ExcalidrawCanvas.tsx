"use client";

import "@excalidraw/excalidraw/index.css";
import { Excalidraw } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import type { MutableRefObject } from "react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ExcalidrawCanvasProps {
  excalidrawRef: MutableRefObject<ExcalidrawImperativeAPI | null>;
}

export default function ExcalidrawCanvas({ excalidrawRef }: ExcalidrawCanvasProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-full w-full bg-background" />;

  return (
    <div className="h-full w-full">
      <Excalidraw
        excalidrawAPI={(api) => {
          excalidrawRef.current = api;
        }}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        UIOptions={{
          canvasActions: {
            saveToActiveFile: false,
            loadScene: true,
            export: { saveFileToDisk: true },
          },
        }}
      />
    </div>
  );
}
