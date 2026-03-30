import { z } from "zod";

const MAX_MARKDOWN_LENGTH = 50_000;
const MAX_SVG_LENGTH = 500_000;
const MAX_CHAT_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 5_000;

export const feedbackRequestSchema = z.object({
  problemSlug: z.string().min(1).max(100),
  markdown: z.string().max(MAX_MARKDOWN_LENGTH).default(""),
  svgString: z.string().max(MAX_SVG_LENGTH).default(""),
  chatHistory: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(MAX_MESSAGE_LENGTH),
      })
    )
    .max(MAX_CHAT_MESSAGES)
    .default([]),
});

export type FeedbackRequest = z.infer<typeof feedbackRequestSchema>;

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts)/gi,
  /system\s*:\s*/gi,
  /\[INST\]/gi,
  /<\|im_start\|>/gi,
  /you\s+are\s+now\s+/gi,
  /pretend\s+you\s+are/gi,
  /forget\s+(all\s+)?(previous|prior|your)\s+(instructions|rules)/gi,
  /score\s+everything\s+10/gi,
  /give\s+(me\s+)?(a\s+)?perfect\s+score/gi,
];

export function sanitizeInput(text: string): string {
  let sanitized = text;
  for (const pattern of INJECTION_PATTERNS) {
    sanitized = sanitized.replace(pattern, "[redacted]");
  }
  return sanitized;
}
