import { ProblemGrid } from "@/components/landing/ProblemGrid";

export const metadata = {
  title: "sys.design — AI System Design Interview Practice",
  description:
    "Practice system design interviews with an AI interviewer, live markdown editor, and Excalidraw diagrams.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <header className="mb-16">
          <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-4">
            System Design Practice
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground mb-3">
            sys.design
          </h1>
          <p className="text-muted-foreground text-base max-w-lg leading-relaxed">
            Practice system design interviews with an AI interviewer. Write,
            diagram, and get structured feedback.
          </p>
        </header>
        <ProblemGrid />
      </div>
    </div>
  );
}
