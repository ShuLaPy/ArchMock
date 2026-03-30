import { getProblemBySlug } from "@/data/problems";
import { feedbackRequestSchema, sanitizeInput } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { runFeedbackPipeline } from "@/lib/feedback-pipeline";
import type { FeedbackStreamEvent } from "@/types/feedback";

export const maxDuration = 120;

export async function POST(req: Request) {
  // Rate limiting
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = rateLimit(ip);
  if (!limit.success) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Try again in a few minutes." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // Input validation
  const body = await req.json().catch(() => null);
  if (!body) {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = feedbackRequestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({
        error: "Invalid request",
        details: parsed.error.issues.map((i) => i.message),
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { problemSlug, markdown, svgString, chatHistory } = parsed.data;

  const problem = getProblemBySlug(problemSlug);
  if (!problem) {
    return new Response(JSON.stringify({ error: "Problem not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Sanitize inputs
  const sanitizedMarkdown = sanitizeInput(markdown);
  const sanitizedSvg = svgString; // SVG is used as-is for image conversion

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const onEvent = (event: FeedbackStreamEvent) => {
        try {
          controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
        } catch {
          // Stream may have been closed by the client
        }
      };

      try {
        await runFeedbackPipeline(
          {
            problem,
            markdown: sanitizedMarkdown,
            svgString: sanitizedSvg,
            chatHistory,
          },
          onEvent
        );
      } catch (err) {
        onEvent({
          type: "error",
          message:
            err instanceof Error ? err.message : "Pipeline failed unexpectedly",
        });
      } finally {
        try {
          controller.close();
        } catch {
          // Already closed
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache",
      "X-RateLimit-Remaining": String(limit.remaining),
    },
  });
}
