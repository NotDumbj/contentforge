import type { DraftType } from "./drafts";

export type Template = {
  id: string;
  name: string;
  type: DraftType;
  typeLabel: string;
  desc: string;
  starterBody: string;
};

export const TEMPLATES: Template[] = [
  {
    id: "how-to-blog",
    name: "How-to blog post",
    type: "blog",
    typeLabel: "Blog post",
    desc: "Problem → steps → recap structure.",
    starterBody: `## Introduction
- Define the reader's main pain point.
- State what they will achieve by the end of this guide.

## Step 1: Preparation
- List prerequisites or tools required.

## Step 2: Implementation
- Break down the core process step by step.

## Step 3: Troubleshooting & Pro Tips
- Common pitfalls to avoid.

## Conclusion & Takeaway
- Summary of the solution and next action.`,
  },
  {
    id: "product-launch",
    name: "Product launch caption",
    type: "social",
    typeLabel: "Social caption",
    desc: "Hook, feature, call to action.",
    starterBody: `🚀 We're excited to announce [Product Name]!

The problem: [Describe reader's struggle]
The solution: [Key value proposition]

✨ Highlights:
- Feature 1: [Benefit]
- Feature 2: [Benefit]
- Feature 3: [Benefit]

👇 Try it now at [Link in bio]`,
  },
  {
    id: "60s-explainer",
    name: "60-second explainer",
    type: "video",
    typeLabel: "Video script",
    desc: "Hook, three beats, single CTA.",
    starterBody: `[00:00 - 00:05] HOOK: Stop struggling with [Problem]. Here's how to fix it in 60 seconds.

[00:05 - 00:20] BEAT 1: The core mistake most people make...
[00:20 - 00:40] BEAT 2: The simple framework to use instead...
[00:40 - 00:50] BEAT 3: Real-world example in action...

[00:50 - 01:00] CALL TO ACTION: Save this post and follow for more daily tips!`,
  },
  {
    id: "weekly-roundup",
    name: "Weekly roundup",
    type: "blog",
    typeLabel: "Blog post",
    desc: "Curated links with one-line takes.",
    starterBody: `# Weekly Roundup: [Topic / Date]

Welcome to this week's edition of top insights, tools, and updates.

### 1. [Story Title 1]
- **Link**: [URL]
- **Takeaway**: Why this matters for creators.

### 2. [Story Title 2]
- **Link**: [URL]
- **Takeaway**: Key lesson or highlight.

### 3. [Tool / Resource of the Week]
- Quick recommendation and why we love it.`,
  },
];

export function getTemplate(id?: string): Template | undefined {
  if (!id) return undefined;
  return TEMPLATES.find((t) => t.id === id);
}
