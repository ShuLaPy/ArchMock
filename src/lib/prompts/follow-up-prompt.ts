import type { FeedbackSection } from "@/types/feedback";
import type { Problem } from "@/types/problem";

export function buildFollowUpPrompt(
  sections: FeedbackSection[],
  problem: Problem
): string {
  const sorted = [...sections].sort((a, b) => a.score - b.score);
  const weakest = sorted.slice(0, 3);
  const partial = sorted.filter((s) => s.score >= 4 && s.score <= 6);

  const weakSummary = weakest
    .map((s) => `- **${s.name}** (${s.score}/10): ${s.feedback.slice(0, 150)}`)
    .join("\n");

  const partialSummary =
    partial.length > 0
      ? partial
          .map(
            (s) =>
              `- **${s.name}** (${s.score}/10): ${s.feedback.slice(0, 150)}`
          )
          .join("\n")
      : "None";

  return `You are a senior staff engineer conducting a system design interview for **${problem.title}**. Based on the candidate's submission, generate follow-up questions.

## Weakest Sections
${weakSummary}

## Sections With Partial Understanding (4-6 range)
${partialSummary}

## Instructions
Generate 3-5 follow-up questions that a real interviewer would ask next:

1. **Prioritize sections with partial understanding (4-6 score)** — these have the most learning value because the candidate showed some knowledge but has gaps
2. **For weak sections (1-3)** — ask foundational questions that would help the candidate build their understanding
3. **Make questions specific to ${problem.title}** — not generic system design questions
4. **Each question should probe a specific gap** identified in the feedback
5. **Questions should be challenging but fair** — the kind that distinguishes good from great candidates

Format each question as a direct interview question (e.g., "How would you handle..." or "What happens when...").`;
}
