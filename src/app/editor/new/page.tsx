import type { Metadata } from "next";
import Link from "next/link";
import { TYPE_LABEL, type DraftType } from "@/lib/drafts";

export const metadata: Metadata = {
  title: "New Draft",
  description: "Start a new blog post, social caption, or video script draft.",
};

const OPTIONS: { type: DraftType; description: string }[] = [
  { type: "blog", description: "Long-form posts with headings, intros, and a clear takeaway." },
  { type: "social", description: "Short captions and carousel copy sized for the feed." },
  { type: "video", description: "Scripts timed to seconds, with beats for voiceover or on-screen text." },
];

export default function NewDraftPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-teal font-mono text-xs tracking-wide uppercase">New draft</p>
      <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight">
        What are you writing?
      </h1>
      <p className="text-ink-soft mt-2 text-sm">
        Pick a format to open a blank draft with the AI assist panel ready.
      </p>

      <div className="mt-8 grid gap-4">
        {OPTIONS.map((option) => (
          <Link
            key={option.type}
            href={`/editor/new-${option.type}`}
            className="border-line bg-paper-raised hover:border-teal focus-visible:border-teal flex items-center justify-between rounded-lg border p-5 transition-colors"
          >
            <div>
              <h2 className="font-display text-lg font-semibold">
                {TYPE_LABEL[option.type]}
              </h2>
              <p className="text-ink-soft mt-1 text-sm">{option.description}</p>
            </div>
            <span aria-hidden className="text-teal font-mono text-xl">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
