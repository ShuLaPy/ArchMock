import type { FeedbackSection } from "@/types/feedback";

export function buildCrossReferencePrompt(
  sections: FeedbackSection[],
  markdown: string,
  svgString: string
): string {
  const sectionSummary = sections
    .map((s) => `- **${s.name}** (${s.score}/10): ${s.feedback.slice(0, 150)}`)
    .join("\n");

  return `You are a principal engineer performing a cross-reference check between a candidate's written system design and their architecture diagram.

## Section Evaluation Summary
${sectionSummary}

## Candidate's Written Design
${markdown || "(No written design provided)"}

## Candidate's Architecture Diagram (SVG)
${svgString ? `<diagram>\n${svgString}\n</diagram>` : "(No diagram provided)"}

## Your Task
Compare the written design against the diagram and identify inconsistencies:

1. **Components in the written design but missing from the diagram** — e.g., the text mentions a Redis cache but the diagram doesn't show it
2. **Components in the diagram but not discussed in the text** — e.g., the diagram shows a message queue but the text never mentions async processing
3. **Score inconsistencies** — e.g., the Architecture section scored 8 but the diagram shows a single-server design with no load balancing

Be specific about what's missing or mismatched. If the diagram is empty or not provided, focus on what SHOULD be in a diagram based on the written design.

List only genuine inconsistencies — do not flag minor differences in naming or organization.`;
}
