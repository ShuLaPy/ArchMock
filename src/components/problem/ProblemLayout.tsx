"use client";

import { useState } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { Problem } from "@/types/problem";
import { ProblemSessionContext } from "@/hooks/useProblemSession";
import { useExcalidrawRef } from "@/hooks/useExcalidrawRef";
import { getMarkdownTemplate } from "@/lib/markdown-template";
import { LeftPanel } from "./LeftPanel";
import { MiddlePanel } from "./MiddlePanel";
import { RightPanel } from "./RightPanel";
import { SubmitButton } from "./SubmitButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProblemLayoutProps {
  problem: Problem;
}

export function ProblemLayout({ problem }: ProblemLayoutProps) {
  const [markdown, setMarkdown] = useState(() => getMarkdownTemplate(problem));
  const { excalidrawRef, getSvgSnapshot } = useExcalidrawRef();

  return (
    <ProblemSessionContext.Provider
      value={{ markdown, setMarkdown, excalidrawRef, getSvgSnapshot }}
    >
      <div className="flex flex-col h-screen bg-background">
        <header className="h-12 shrink-0 flex items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-border">/</span>
            <span className="text-foreground font-medium">
              {problem.title}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SubmitButton problemSlug={problem.slug} />
          </div>
        </header>

        <div className="flex-1 min-h-0">
          <Group
            orientation="horizontal"
            id={`layout-${problem.slug}`}
            className="h-full"
          >
            <Panel defaultSize={25} minSize={15} className="overflow-hidden">
              <LeftPanel problem={problem} />
            </Panel>
            <Separator className="w-px bg-border hover:bg-ring transition-colors cursor-col-resize" />
            <Panel defaultSize={40} minSize={20} className="overflow-hidden">
              <MiddlePanel />
            </Panel>
            <Separator className="w-px bg-border hover:bg-ring transition-colors cursor-col-resize" />
            <Panel defaultSize={35} minSize={20} className="overflow-hidden">
              <RightPanel />
            </Panel>
          </Group>
        </div>
      </div>
    </ProblemSessionContext.Provider>
  );
}
