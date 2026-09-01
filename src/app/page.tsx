"use client";

import Link from "next/link";
import { useDrafts } from "@/lib/use-drafts";
import { DraftCard } from "@/components/draft-card";

export default function DashboardPage() {
  const { drafts, deleteDraft, isLoaded } = useDrafts();
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
            {isLoaded ? (
              `${inProgress} draft${inProgress === 1 ? "" : "s"} in progress`
            ) : (
              "Loading drafts…"
            )}
          </p>
        </div>
        <Link
          href="/editor/new"
          className="bg-ink text-paper hover:bg-teal rounded-md px-4 py-2 text-sm font-medium transition-colors"
        >
          New draft
        </Link>
      </header>

      {drafts.length === 0 ? (
        <div className="border-line bg-paper-raised rounded-lg border p-8 text-center">
          <p className="text-ink-soft text-sm">No drafts yet.</p>
          <Link
            href="/editor/new"
            className="text-teal mt-2 inline-block font-mono text-xs underline"
          >
            Create your first draft →
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 pt-2 sm:grid-cols-2">
          {drafts.map((draft) => (
            <DraftCard key={draft.id} draft={draft} onDelete={deleteDraft} />
          ))}
        </div>
      )}
    </div>
  );
}

