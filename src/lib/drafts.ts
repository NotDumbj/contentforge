// Placeholder in-memory data for the Foundations-phase skeleton.
// Swap for a real database/API in the Build phase.

export type DraftType = "blog" | "social" | "video";

export type Draft = {
  id: string;
  title: string;
  type: DraftType;
  excerpt: string;
  wordCount: number;
  updatedAt: string; // ISO date
  status: "drafting" | "in-review" | "published";
};

export const TYPE_LABEL: Record<DraftType, string> = {
  blog: "Blog post",
  social: "Social caption",
  video: "Video script",
};

export const drafts: Draft[] = [
  {
    id: "d1",
    title: "Why creative teams are shipping faster with AI drafts",
    type: "blog",
    excerpt: "A look at how drafting workflows change when the first pass is instant.",
    wordCount: 1120,
    updatedAt: "2026-08-24",
    status: "in-review",
  },
  {
    id: "d2",
    title: "Launch week countdown — Day 3",
    type: "social",
    excerpt: "Carousel copy teasing the new template library.",
    wordCount: 86,
    updatedAt: "2026-08-27",
    status: "drafting",
  },
  {
    id: "d3",
    title: "Studio tour walkthrough",
    type: "video",
    excerpt: "60-second script introducing the editor and AI assist panel.",
    wordCount: 240,
    updatedAt: "2026-08-20",
    status: "published",
  },
];

export function getDraft(id: string): Draft | undefined {
  return drafts.find((d) => d.id === id);
}
