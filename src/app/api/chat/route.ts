import { NextResponse } from "next/server";
import { streamText } from "ai";
import {
  getGoogleAIProvider,
  GEMINI_MODEL_NAME,
  getContextualSystemPrompt,
} from "@/lib/ai-config";
import type { DraftType } from "@/lib/drafts";

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    return NextResponse.json(
      {
        error:
          "GEMINI_API_KEY environment variable is not configured on the server. Please add it to your .env.local file.",
      },
      { status: 400 }
    );
  }

  try {
    const { messages, type, title, body } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: 'messages' array is required." },
        { status: 400 }
      );
    }

    const google = getGoogleAIProvider(apiKey);
    const system = getContextualSystemPrompt(
      type as DraftType | undefined,
      title as string | undefined,
      body as string | undefined
    );

    const result = streamText({
      model: google(GEMINI_MODEL_NAME),
      system,
      messages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    console.error("API /api/chat error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while streaming AI chat response.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
