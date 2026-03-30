import type { FeedbackSection } from "@/types/feedback";
import type { Problem } from "@/types/problem";

export function buildCalibrationPrompt(
  sections: FeedbackSection[],
  inconsistencies: string[],
  diagramFeedback: string,
  problem: Problem
): string {
  const sectionScores = sections
    .map((s) => `- **${s.name}**: ${s.score}/10 — ${s.feedback.slice(0, 200)}`)
    .join("\n");

  const inconsistencyText =
    inconsistencies.length > 0
      ? inconsistencies.map((i) => `- ${i}`).join("\n")
      : "No significant inconsistencies found.";

  return `You are a principal engineer performing final calibration on a system design interview evaluation for **${problem.title}**.

## Individual Section Scores
${sectionScores}

## Cross-Reference Findings
${inconsistencyText}

## Diagram Analysis
${diagramFeedback || "No diagram was provided or analyzed."}

## Your Task
1. **Review score consistency** — Sections that depend on each other should have correlated scores. For example:
   - If Requirements scored 3, Capacity Estimation can't reasonably be 9 (it depends on clear requirements)
   - If Database Design scored 8 but the diagram shows no database, something is off
   - If Architecture scored high but Scalability scored low, check if the architecture actually addresses scale

2. **Calculate an overall score** (1-10) as a weighted assessment of the full design, not just an average. Weight Architecture and Deep Dives slightly higher.

3. **Write a 2-3 sentence summary** of the candidate's performance — what they did well and where the biggest gaps are.

4. **List 3-5 strengths** — specific things the candidate did well (reference actual content).

5. **List 3-5 improvements** — specific, actionable areas where the candidate should improve.

Calibrate as a principal engineer at a top-tier company. A score of 7+ means genuinely solid work, not just "they tried."`;
}
