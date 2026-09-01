import { NextResponse } from "next/server";
import type { DraftType } from "@/lib/drafts";

const SYSTEM_INSTRUCTION = `You are an expert AI content editor and writing coach for creators working on ContentForge.
Your goal is to provide one concise, high-impact, actionable editing suggestion or next step to improve the creator's draft.
Keep your response direct, actionable, and under 3 sentences (or 1-2 bullet points). Do not write intro/outro pleasantries (e.g. "Sure!", "Here is a suggestion:").`;

function buildPrompt(type: DraftType, title: string, body: string): string {
  const safeTitle = title.trim() || "Untitled draft";
  const safeBody = body.trim() || "(No content written yet)";

  switch (type) {
    case "social":
      return `Content Type: Social caption
Title: ${safeTitle}
Draft Content:
${safeBody}

Review the social media caption above. Give one concise, actionable suggestion to sharpen the opening hook, boost audience engagement/comments, or improve readability for mobile feeds. (If the draft is empty, suggest 2-3 engaging opening hooks).`;

    case "video":
      return `Content Type: Video script
Title: ${safeTitle}
Draft Content:
${safeBody}

Review the video script above. Give one concise, practical suggestion to strengthen the initial 3-second hook, pacing, visual scene transitions, or the final call-to-action. (If the draft is empty, suggest a 3-beat video concept).`;

    case "blog":
    default:
      return `Content Type: Blog post
Title: ${safeTitle}
Draft Content:
${safeBody}

Review the blog post draft above. Give one concise, high-leverage editing suggestion to improve the headline, intro hook, paragraph flow, or key takeaway message. (If the draft is empty, suggest a strong outline structure or opening angle based on the title).`;
  }
}

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
    const { type, title, body } = (await req.json()) as {
      type: DraftType;
      title: string;
      body: string;
    };

    const userPrompt = buildPrompt(type, title, body);
    const fullPrompt = `${SYSTEM_INSTRUCTION}\n\n${userPrompt}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: fullPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 350,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API Error [${response.status}]:`, errorText);

      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          {
            error:
              "Invalid GEMINI_API_KEY. Please verify your API key in environment variables.",
          },
          { status: response.status }
        );
      }

      if (response.status === 429) {
        return NextResponse.json(
          {
            error:
              "Gemini API rate limit reached. Please wait a moment before requesting another suggestion.",
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error: `Gemini API request failed (${response.status}). Please try again later.`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const suggestionText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!suggestionText) {
      return NextResponse.json(
        { error: "The AI model did not return a valid suggestion." },
        { status: 500 }
      );
    }

    return NextResponse.json({ suggestion: suggestionText.trim() });
  } catch (err) {
    console.error("API /api/generate unhandled error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while generating suggestions." },
      { status: 500 }
    );
  }
}
