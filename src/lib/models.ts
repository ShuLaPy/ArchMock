/**
 * LiteLLM-style model configuration.
 *
 * Set models via environment variables using "provider/model-id" format:
 *   CHAT_MODEL=openrouter/google/gemini-2.0-flash
 *   FEEDBACK_MODEL=openrouter/google/gemini-2.5-pro
 *
 * Supported providers and example model strings:
 *
 *   openrouter  openrouter/google/gemini-2.0-flash
 *               openrouter/google/gemini-2.5-pro
 *               openrouter/anthropic/claude-sonnet-4-5
 *               openrouter/meta-llama/llama-3.3-70b-instruct
 *               openrouter/deepseek/deepseek-chat
 *               (any model slug from openrouter.ai/models)
 *
 *   google      google/gemini-2.5-pro
 *               google/gemini-2.0-flash
 *
 *   anthropic   anthropic/claude-opus-4-5
 *               anthropic/claude-sonnet-4-5
 *               anthropic/claude-haiku-4-5
 *
 *   openai      openai/gpt-4o
 *               openai/gpt-4o-mini
 *               openai/o3
 *
 *   groq        groq/llama-3.3-70b-versatile
 *               groq/gemma2-9b-it
 *
 *   mistral     mistral/mistral-large-latest
 *               mistral/mistral-small-latest
 *
 * Required API key env vars per provider:
 *   openrouter  OPENROUTER_API_KEY
 *   google      GOOGLE_GENERATIVE_AI_API_KEY
 *   anthropic   ANTHROPIC_API_KEY
 *   openai      OPENAI_API_KEY
 *   groq        GROQ_API_KEY
 *   mistral     MISTRAL_API_KEY
 */

import type { LanguageModel } from "ai";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";
import { openai, createOpenAI } from "@ai-sdk/openai";
import { groq } from "@ai-sdk/groq";
import { mistral } from "@ai-sdk/mistral";

function openrouterModel(modelId: string): LanguageModel {
  // OpenRouter only supports /chat/completions, not the new /responses endpoint.
  // Use .chat() to force the Chat Completions API instead of the default Responses API.
  const client = createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    headers: {
      "HTTP-Referer": "https://sys.design",
      "X-Title": "sys.design",
    },
  });
  return client.chat(modelId);
}

export function createModel(modelString: string): LanguageModel {
  // OpenRouter model IDs contain multiple slashes (e.g. "openrouter/google/gemini-2.0-flash")
  // so we split only on the first slash to get the provider.
  const slashIndex = modelString.indexOf("/");
  if (slashIndex === -1) {
    throw new Error(
      `Invalid model format: "${modelString}". Use "provider/model-id" (e.g. "openrouter/google/gemini-2.0-flash").`
    );
  }

  const provider = modelString.slice(0, slashIndex);
  const modelId = modelString.slice(slashIndex + 1);

  switch (provider) {
    case "openrouter":
      return openrouterModel(modelId);
    case "google":
      return google(modelId);
    case "anthropic":
      return anthropic(modelId);
    case "openai":
      return openai(modelId);
    case "groq":
      return groq(modelId);
    case "mistral":
      return mistral(modelId);
    default:
      throw new Error(
        `Unsupported provider: "${provider}". Supported: openrouter, google, anthropic, openai, groq, mistral.`
      );
  }
}

/** Fast model for streaming chat responses. */
export const chatModel = createModel(
  process.env.CHAT_MODEL ?? "openrouter/google/gemini-2.0-flash"
);

/** Powerful model for structured feedback analysis. */
export const feedbackModel = createModel(
  process.env.FEEDBACK_MODEL ?? "openrouter/google/gemini-2.0-flash"
);

/** Strong model for section-by-section evaluation. */
export const evaluationModel = createModel(
  process.env.EVALUATION_MODEL ?? "google/gemini-2.5-pro"
);

/** Vision-capable model for diagram analysis. */
export const visionModel = createModel(
  process.env.VISION_MODEL ?? "google/gemini-2.5-pro"
);
