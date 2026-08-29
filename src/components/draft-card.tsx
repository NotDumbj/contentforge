import Link from "next/link";
import type { Draft } from "@/lib/drafts";
import { TYPE_LABEL } from "@/lib/drafts";

const TAB_STYLE: Record<Draft["type"], string> = {
  blog: "bg-teal text-paper-raised",
  social: "bg-highlight text-ink",
  video: "border border-ink text-ink bg-transparent",
};

export function DraftCard({ draft }: { draft: Draft }) {
  return (
    <Link
      href={`/editor/${draft.id}`}
      className="border-line bg-paper-raised hover:border-teal focus-visible:border-teal group relative block rounded-lg border p-5 transition-colors"
    >
      <span
        className={`font-mono absolute -top-2.5 left-4 rounded px-2 py-0.5 text-[11px] tracking-wide uppercase ${TAB_STYLE[draft.type]}`}
      >
        {TYPE_LABEL[draft.type]}
      </span>
      <h3 className="font-display mt-2 text-lg leading-snug font-semibold">
        {draft.title}
      </h3>
      <p className="text-ink-soft mt-2 text-sm leading-relaxed">
        {draft.excerpt}
      </p>
      <div className="text-ink-soft font-mono mt-4 flex items-center justify-between text-xs">
        <span>{draft.wordCount.toLocaleString()} words</span>
        <span>{draft.status}</span>
        <span>{draft.updatedAt}</span>
      </div>
    </Link>
  );
}
