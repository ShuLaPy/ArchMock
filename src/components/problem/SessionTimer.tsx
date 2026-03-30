"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function SessionTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const toggle = useCallback(() => setRunning((r) => !r), []);

  const reset = useCallback(() => {
    setElapsed(0);
    setRunning(true);
  }, []);

  const isWarning = elapsed >= 2700; // 45 min
  const isDanger = elapsed >= 3600; // 60 min

  return (
    <div className="flex items-center gap-1.5">
      <Timer className="w-3.5 h-3.5 text-muted-foreground" />
      <span
        className={`text-sm font-mono tabular-nums ${
          isDanger
            ? "text-red-500"
            : isWarning
            ? "text-amber-500"
            : "text-muted-foreground"
        }`}
      >
        {formatTime(elapsed)}
      </span>
      <button
        onClick={toggle}
        className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        title={running ? "Pause" : "Resume"}
      >
        {running ? (
          <Pause className="w-3 h-3" />
        ) : (
          <Play className="w-3 h-3" />
        )}
      </button>
      <button
        onClick={reset}
        className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        title="Reset timer"
      >
        <RotateCcw className="w-3 h-3" />
      </button>
    </div>
  );
}
