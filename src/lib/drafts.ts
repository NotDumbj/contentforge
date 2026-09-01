// NOTE: Currently using browser-only client-side persistence (localStorage).
// A real database / backend API integration is a future step.

export type DraftType = "blog" | "social" | "video";

export type Draft = {
  id: string;
  title: string;
  type: DraftType;
  excerpt: string;
  wordCount: number;
  updatedAt: string; // ISO date
  status: "drafting" | "in-review" | "published";
  body?: string;
};

export const TYPE_LABEL: Record<DraftType, string> = {
  blog: "Blog post",
  social: "Social caption",
  video: "Video script",
};

export const INITIAL_DRAFTS: Draft[] = [
  {
    id: "d1",
    title: "Why creative teams are shipping faster with AI drafts",
    type: "blog",
    excerpt: "A look at how drafting workflows change when the first pass is instant.",
    body: "A look at how drafting workflows change when the first pass is instant.\n\nCreative teams are scaling content output by using AI to generate high-quality first passes. This lets writers focus on refining tone, context, and strategic messaging.",
    wordCount: 1120,
    updatedAt: "2026-08-24",
    status: "in-review",
  },
  {
    id: "d2",
    title: "Launch week countdown — Day 3",
    type: "social",
    excerpt: "Carousel copy teasing the new template library.",
    body: "Carousel copy teasing the new template library.\n\nDay 3 of our launch week! Today we're unveiling our modular prompt templates. Ready to accelerate your workflow?",
    wordCount: 86,
    updatedAt: "2026-08-27",
    status: "drafting",
  },
  {
    id: "d3",
    title: "Studio tour walkthrough",
    type: "video",
    excerpt: "60-second script introducing the editor and AI assist panel.",
    body: "60-second script introducing the editor and AI assist panel.\n\n[00:00 - Intro] Welcome to ContentForge!\n[00:15 - Demo] Watch how the editor workspace generates suggestions on demand.",
    wordCount: 240,
    updatedAt: "2026-08-20",
    status: "published",
  },
];

// Fallback for static server render context if needed
export const drafts: Draft[] = INITIAL_DRAFTS;

export function getDraft(id: string): Draft | undefined {
  return INITIAL_DRAFTS.find((d) => d.id === id);
}

