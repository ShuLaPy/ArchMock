import { generateText, Output } from "ai";
import { z } from "zod";
import type { Problem } from "@/types/problem";
import type {
  FeedbackSection,
  FeedbackStreamEvent,
  StructuredFeedback,
} from "@/types/feedback";
import { evaluationModel, visionModel } from "@/lib/models";
import {
  SECTION_DEFINITIONS,
  sectionResultSchema,
} from "@/lib/prompts/section-prompts";
import { buildCrossReferencePrompt } from "@/lib/prompts/cross-reference-prompt";
import { buildCalibrationPrompt } from "@/lib/prompts/calibration-prompt";
import { buildFollowUpPrompt } from "@/lib/prompts/follow-up-prompt";

interface PipelineInput {
  problem: Problem;
  markdown: string;
  svgString: string;
  chatHistory: { role: string; content: string }[];
}

const RETRY_DELAY_MS = 2000;

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err: unknown) {
    const status =
      err instanceof Error && "status" in err
        ? (err as { status: number }).status
        : 0;
    if (status === 429 || status >= 500) {
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      return fn();
    }
    throw err;
  }
}

// --- Step 2: Section-by-section evaluation (parallel) ---

async function evaluateSection(
  def: (typeof SECTION_DEFINITIONS)[number],
  input: PipelineInput
): Promise<FeedbackSection> {
  const prompt = def.buildPrompt(input.problem, input.markdown, input.chatHistory);

  const result = await withRetry(() =>
    generateText({
      model: evaluationModel,
      output: Output.object({ schema: sectionResultSchema }),
      prompt,
    })
  );

  const output = await result.output;
  return {
    name: def.name,
    score: output!.score,
    feedback: output!.feedback,
    suggestions: output!.suggestions,
  };
}

// --- Step 3: Cross-reference check ---

const crossReferenceSchema = z.object({
  inconsistencies: z.array(z.string()),
});

async function runCrossReference(
  sections: FeedbackSection[],
  markdown: string,
  svgString: string
): Promise<string[]> {
  const prompt = buildCrossReferencePrompt(sections, markdown, svgString);

  const result = await withRetry(() =>
    generateText({
      model: evaluationModel,
      output: Output.object({ schema: crossReferenceSchema }),
      prompt,
    })
  );

  const output = await result.output;
  return output!.inconsistencies;
}

// --- Step 4: Diagram vision analysis ---

async function runDiagramAnalysis(svgString: string): Promise<string> {
  if (!svgString.trim()) return "";

  const svgBase64 = Buffer.from(svgString).toString("base64");
  const svgDataUrl = `data:image/svg+xml;base64,${svgBase64}`;

  const result = await withRetry(() =>
    generateText({
      model: visionModel,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a principal engineer reviewing a system design architecture diagram. Analyze this diagram and provide feedback on:

1. **Component placement and organization** — Is the layout logical? Are related components grouped?
2. **Data flow** — Are arrows/connections showing clear data flow? Any missing connections?
3. **Missing components** — Based on what's drawn, what critical components are absent?
4. **Anti-patterns** — Single points of failure, missing load balancers, no caching layer, etc.
5. **Overall diagram quality** — Is it clear enough for another engineer to understand the architecture?

Be specific about what you see in the diagram. Keep your analysis to 3-5 key observations.`,
            },
            {
              type: "image",
              image: svgDataUrl,
            },
          ],
        },
      ],
    })
  );

  return result.text;
}

// --- Step 5: Score calibration + synthesis ---

const calibrationSchema = z.object({
  overallScore: z.number().min(1).max(10),
  summary: z.string(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  adjustedScores: z
    .array(
      z.object({
        name: z.string(),
        adjustedScore: z.number().min(1).max(10),
      })
    )
    .optional(),
});

async function runCalibration(
  sections: FeedbackSection[],
  inconsistencies: string[],
  diagramFeedback: string,
  problem: Problem
): Promise<{
  overallScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  adjustedScores?: { name: string; adjustedScore: number }[];
}> {
  const prompt = buildCalibrationPrompt(
    sections,
    inconsistencies,
    diagramFeedback,
    problem
  );

  const result = await withRetry(() =>
    generateText({
      model: evaluationModel,
      output: Output.object({ schema: calibrationSchema }),
      prompt,
    })
  );

  return result.output!;
}

// --- Step 6: Follow-up questions ---

const followUpSchema = z.object({
  followUpQuestions: z.array(z.string()).max(5),
});

async function runFollowUp(
  sections: FeedbackSection[],
  problem: Problem
): Promise<string[]> {
  const prompt = buildFollowUpPrompt(sections, problem);

  const result = await withRetry(() =>
    generateText({
      model: evaluationModel,
      output: Output.object({ schema: followUpSchema }),
      prompt,
    })
  );

  return result.output!.followUpQuestions;
}

// --- Main pipeline ---

export async function runFeedbackPipeline(
  input: PipelineInput,
  onEvent: (event: FeedbackStreamEvent) => void
): Promise<StructuredFeedback> {
  // Step 2: Parallel section evaluations
  const sectionPromises = SECTION_DEFINITIONS.map(async (def) => {
    try {
      const section = await evaluateSection(def, input);
      onEvent({ type: "section_complete", section });
      return section;
    } catch (err) {
      const fallback: FeedbackSection = {
        name: def.name,
        score: 0,
        feedback: `Evaluation failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        suggestions: [],
      };
      onEvent({ type: "section_complete", section: fallback });
      return fallback;
    }
  });

  const sections = await Promise.all(sectionPromises);

  // Steps 3 + 4: Cross-reference and diagram analysis (parallel)
  let inconsistencies: string[] = [];
  let diagramFeedback = "";

  try {
    const [crossRefResult, diagramResult] = await Promise.all([
      runCrossReference(sections, input.markdown, input.svgString).catch(
        (err) => {
          console.error("Cross-reference failed:", err);
          return [] as string[];
        }
      ),
      runDiagramAnalysis(input.svgString).catch((err) => {
        console.error("Diagram analysis failed:", err);
        return "";
      }),
    ]);

    inconsistencies = crossRefResult;
    diagramFeedback = diagramResult;

    if (inconsistencies.length > 0) {
      onEvent({ type: "cross_reference", inconsistencies });
    }
    if (diagramFeedback) {
      onEvent({ type: "diagram_analysis", diagramFeedback });
    }
  } catch (err) {
    console.error("Cross-ref/diagram step failed:", err);
  }

  // Step 5: Calibration
  let overallScore = 0;
  let summary = "";
  let strengths: string[] = [];
  let improvements: string[] = [];

  try {
    const calibration = await runCalibration(
      sections,
      inconsistencies,
      diagramFeedback,
      input.problem
    );

    overallScore = calibration.overallScore;
    summary = calibration.summary;
    strengths = calibration.strengths;
    improvements = calibration.improvements;

    // Apply adjusted scores if provided
    if (calibration.adjustedScores) {
      for (const adj of calibration.adjustedScores) {
        const section = sections.find((s) => s.name === adj.name);
        if (section) section.score = adj.adjustedScore;
      }
    }

    onEvent({
      type: "calibration",
      overallScore,
      summary,
      strengths,
      improvements,
    });
  } catch (err) {
    console.error("Calibration failed, using average:", err);
    const validScores = sections.filter((s) => s.score > 0).map((s) => s.score);
    overallScore =
      validScores.length > 0
        ? Math.round(
            validScores.reduce((a, b) => a + b, 0) / validScores.length
          )
        : 1;
    summary = "Calibration failed — scores are raw section averages.";
    strengths = [];
    improvements = [];

    onEvent({
      type: "calibration",
      overallScore,
      summary,
      strengths,
      improvements,
    });
  }

  // Step 6: Follow-up questions
  let followUpQuestions: string[] = [];

  try {
    followUpQuestions = await runFollowUp(sections, input.problem);
    onEvent({ type: "follow_up", followUpQuestions });
  } catch (err) {
    console.error("Follow-up generation failed:", err);
    followUpQuestions = [];
    onEvent({ type: "follow_up", followUpQuestions: [] });
  }

  // Assemble final result
  const feedback: StructuredFeedback = {
    overallScore,
    summary,
    sections,
    strengths,
    improvements,
    followUpQuestions,
  };

  onEvent({ type: "complete", feedback });
  return feedback;
}
