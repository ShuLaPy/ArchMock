import { streamText, convertToModelMessages } from "ai";
import { getProblemBySlug } from "@/data/problems";
import { buildChatSystemPrompt } from "@/lib/prompts";
import { chatModel } from "@/lib/models";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, problemSlug, markdownContext, svgContext } =
    await req.json();

  if (!problemSlug || typeof problemSlug !== "string") {
    return new Response(
      JSON.stringify({ error: "Missing required field: problemSlug" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const problem = getProblemBySlug(problemSlug);
  if (!problem) {
    return new Response(
      JSON.stringify({
        error: `Problem not found for slug: "${problemSlug}". Make sure the slug matches a valid problem.`,
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const systemPrompt = buildChatSystemPrompt(
    problem,
    markdownContext ?? "",
    svgContext ?? ""
  );

  const modelMessages = await convertToModelMessages(messages ?? []);

  const result = await streamText({
    model: chatModel,
    system: systemPrompt,
    messages: modelMessages,
    maxOutputTokens: 512,
  });

  return result.toTextStreamResponse();
}
