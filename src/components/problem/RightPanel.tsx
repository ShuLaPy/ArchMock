"use client";

import dynamic from "next/dynamic";
import { useProblemSession } from "@/hooks/useProblemSession";

const ExcalidrawCanvas = dynamic(
  () => import("@/components/canvas/ExcalidrawCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-background">
        <div className="text-muted-foreground text-sm">Loading canvas...</div>
      </div>
    ),
  }
);

export function RightPanel() {
  const { excalidrawRef } = useProblemSession();

  return (
    <div className="h-full w-full bg-background overflow-hidden">
      <ExcalidrawCanvas excalidrawRef={excalidrawRef} />
    </div>
  );
}
