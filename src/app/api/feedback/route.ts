import { generateText, Output } from "ai";
import { z } from "zod";
import { getProblemBySlug } from "@/data/problems";
import { buildFeedbackPrompt } from "@/lib/prompts";
import { feedbackModel } from "@/lib/models";

export const maxDuration = 60;

const feedbackSchema = z.object({
  overallScore: z.number().min(1).max(10),
  summary: z.string(),
  sections: z.array(
    z.object({
      name: z.string(),
      score: z.number().min(1).max(10),
      feedback: z.string(),
      suggestions: z.array(z.string()),
    })
  ),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  followUpQuestions: z.array(z.string()).max(5),
});

export async function POST(req: Request) {
  const { problemSlug, markdown, svgString } = await req.json();

  const problem = getProblemBySlug(problemSlug);
  if (!problem) {
    return new Response("Problem not found", { status: 404 });
  }

  const result = await generateText({
    model: feedbackModel,
    output: Output.object({ schema: feedbackSchema }),
    prompt: buildFeedbackPrompt(problem, markdown ?? "", svgString ?? ""),
  });

  const data = await result.output;
  return Response.json(data);
}
