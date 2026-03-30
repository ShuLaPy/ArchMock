import { PROBLEMS } from "@/data/problems";
import { ProblemCard } from "./ProblemCard";

export function ProblemGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {PROBLEMS.map((problem) => (
        <ProblemCard key={problem.slug} problem={problem} />
      ))}
    </div>
  );
}
