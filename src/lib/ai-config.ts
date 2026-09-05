import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { TYPE_LABEL, type DraftType } from "./drafts";

/**
 * The current Gemini Flash model used for AI chat streaming and editorial assistance.
 * Using gemini-3.5-flash for low latency and high quality recommendations.
 */
export const GEMINI_MODEL_NAME = "gemini-3.5-flash";

/**
 * Base system prompt for ContentForge's AI editorial assistant.
 * Describes an expert editorial assistant aware of content types (blog, social, video)
 * matching the tone and format expectations in TYPE_LABEL.
 */
export const SYSTEM_PROMPT = `You are an expert AI editorial assistant and creative co-pilot for ContentForge, an AI content studio for creators.

Your primary purpose is to help creators refine, improve, and format their content drafts. You assist with both titles (hooks, headlines, angles) and body content (structure, tone, pacing, clarity, engagement).

You are deeply aware of content formats and adapt your assistance accordingly:
- ${TYPE_LABEL.blog} ("blog"): Focus on punchy title headlines, clear section headings (H2/H3), engaging lead paragraphs, smooth transitions, readability, SEO clarity, and strong takeaways.
- ${TYPE_LABEL.social} ("social"): Focus on stopping-the-scroll opening hooks, punchy conciseness, line breaks for mobile feed scannability, strategic emoji use, and strong calls-to-action (CTAs).
- ${TYPE_LABEL.video} ("video"): Focus on high-retention 3-second visual/verbal hooks, visual scene cues/bracketed stage directions (e.g., [00:00 - Intro], [B-roll: ...]), clear audio pacing, and memorable closing CTAs.

General Editorial Principles:
1. Be constructive, practical, and inspiring.
2. When offering edits, explain *why* the suggestion improves the piece.
3. Keep responses structured, concise, and easy to read using Markdown.
4. When drafting content directly, match the requested style and tone.`;

/**
 * Helper to generate a contextualized system prompt including current draft metadata.
 *
 * @param type - Optional DraftType ("blog" | "social" | "video")
 * @param title - Optional current title of the draft
 * @param body - Optional current body content of the draft
 * @returns A comprehensive system prompt tailored to the draft context
 */
export function getContextualSystemPrompt(
  type?: DraftType,
  title?: string,
  body?: string
): string {
  const typeLabel = type && TYPE_LABEL[type] ? TYPE_LABEL[type] : undefined;

  let contextualPrompt = SYSTEM_PROMPT;

  if (typeLabel || title || body) {
    contextualPrompt += `\n\n--- Current Active Draft Context ---`;
    if (typeLabel) {
      contextualPrompt += `\nContent Type: ${typeLabel} (${type})`;
    }
    if (title && title.trim()) {
      contextualPrompt += `\nTitle: "${title.trim()}"`;
    }
    if (body && body.trim()) {
      contextualPrompt += `\nBody Content:\n${body.trim()}`;
    }
    contextualPrompt += `\n-------------------------------------`;
    contextualPrompt += `\nKeep your advice and generated copy specifically tailored to this active draft context.`;
  }

  return contextualPrompt;
}

/**
 * Creates and returns an instance of the Google Generative AI provider using
 * the server-side GEMINI_API_KEY environment variable.
 *
 * @param apiKey - Optional explicit API key override (defaults to process.env.GEMINI_API_KEY)
 */
export function getGoogleAIProvider(apiKey?: string) {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key || key.trim() === "") {
    throw new Error(
      "GEMINI_API_KEY environment variable is not configured on the server."
    );
  }
  return createGoogleGenerativeAI({ apiKey: key });
}
