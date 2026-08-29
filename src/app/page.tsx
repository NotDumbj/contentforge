import Link from "next/link";
import { drafts } from "@/lib/drafts";
import { DraftCard } from "@/components/draft-card";

export default function DashboardPage() {
  const inProgress = drafts.filter((d) => d.status !== "published").length;

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-teal font-mono text-xs tracking-wide uppercase">
            Dashboard
          </p>
          <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight">
            Your drafts
          </h1>
          <p className="text-ink-soft mt-2 text-sm">
            {inProgress} draft{inProgress === 1 ? "" : "s"} in progress
          </p>
        </div>
        <Link
          href="/editor/new"
          className="bg-ink text-paper hover:bg-teal rounded-md px-4 py-2 text-sm font-medium transition-colors"
        >
          New draft
        </Link>
      </header>

      <div className="grid gap-6 pt-2 sm:grid-cols-2">
        {drafts.map((draft) => (
          <DraftCard key={draft.id} draft={draft} />
        ))}
      </div>
    </div>
  );
}
