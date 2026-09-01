import Link from "next/link";
import type { Draft } from "@/lib/drafts";
import { TYPE_LABEL } from "@/lib/drafts";

const TAB_STYLE: Record<Draft["type"], string> = {
  blog: "bg-teal text-paper-raised",
  social: "bg-highlight text-ink",
  video: "border border-ink text-ink bg-transparent",
};

export function DraftCard({
  draft,
  onDelete,
}: {
  draft: Draft;
  onDelete?: (id: string) => void;
}) {
  return (
    <div className="border-line bg-paper-raised hover:border-teal group relative rounded-lg border p-5 transition-colors">
      <Link href={`/editor/${draft.id}`} className="block">
        <span
          className={`font-mono absolute -top-2.5 left-4 rounded px-2 py-0.5 text-[11px] tracking-wide uppercase ${TAB_STYLE[draft.type]}`}
        >
          {TYPE_LABEL[draft.type]}
        </span>
        <h3 className="font-display mt-2 text-lg leading-snug font-semibold group-hover:text-teal transition-colors">
          {draft.title || "Untitled draft"}
        </h3>
        <p className="text-ink-soft mt-2 text-sm leading-relaxed line-clamp-2">
          {draft.excerpt || "No content yet."}
        </p>
      </Link>
      <div className="text-ink-soft font-mono mt-4 flex items-center justify-between text-xs">
        <span>{draft.wordCount.toLocaleString()} words</span>
        <span>{draft.status}</span>
        <div className="flex items-center gap-3">
          <span>{draft.updatedAt}</span>
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (confirm(`Delete "${draft.title || "Untitled draft"}"?`)) {
                  onDelete(draft.id);
                }
              }}
              className="text-danger hover:underline focus-visible:underline"
              aria-label={`Delete ${draft.title}`}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
