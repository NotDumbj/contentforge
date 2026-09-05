"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDrafts } from "@/lib/use-drafts";
import type { DraftType } from "@/lib/drafts";

import { AiChatPanel } from "@/components/ai-chat-panel";

export function EditorWorkspace({
  draftId,
  type,
  initialTitle = "",
  initialBody = "",
}: {
  draftId?: string;
  type: DraftType;
  initialTitle?: string;
  initialBody?: string;
}) {
  const router = useRouter();
  const { drafts, createDraft, updateDraft, isLoaded } = useDrafts();

  const isNew = !draftId || draftId.startsWith("new-");
  const existingDraft = !isNew ? drafts.find((d) => d.id === draftId) : undefined;

  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [panelOpen, setPanelOpen] = useState(true);

  const [loadedDraftId, setLoadedDraftId] = useState<string | null>(null);
  const [savedTitle, setSavedTitle] = useState(initialTitle);
  const [savedBody, setSavedBody] = useState(initialBody);

  if (isLoaded && existingDraft && existingDraft.id !== loadedDraftId) {
    setLoadedDraftId(existingDraft.id);
    const loadedBody = existingDraft.body ?? existingDraft.excerpt ?? "";
    setTitle(existingDraft.title);
    setBody(loadedBody);
    setSavedTitle(existingDraft.title);
    setSavedBody(loadedBody);
  }

  const wordCount = body.trim().length === 0 ? 0 : body.trim().split(/\s+/).length;
  const isDirty = title !== savedTitle || body !== savedBody;

  function handleSave() {
    const trimmedTitle = title.trim() || "Untitled draft";
    const excerpt = body.trim().slice(0, 120) || trimmedTitle;

    if (isNew) {
      const created = createDraft({
        title: trimmedTitle,
        type,
        body,
        excerpt,
        wordCount,
        status: "drafting",
      });
      setSavedTitle(created.title);
      setSavedBody(created.body ?? body);
      router.push(`/editor/${created.id}`);
    } else if (draftId) {
      updateDraft(draftId, {
        title: trimmedTitle,
        body,
        excerpt,
        wordCount,
      });
      setSavedTitle(title);
      setSavedBody(body);
    }
  }

  if (isLoaded && !isNew && !existingDraft) {
    return (
      <div className="border-line bg-paper-raised rounded-lg border p-8 text-center">
        <h2 className="font-display text-xl font-semibold">Draft not found</h2>
        <p className="text-ink-soft mt-2 text-sm">
          This draft may have been deleted or does not exist in local storage.
        </p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="bg-ink text-paper hover:bg-teal mt-4 rounded-md px-4 py-2 text-sm font-medium transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <h1 className="sr-only">{title || "Draft Editor"}</h1>
      {/* Draft pane */}
      <div className="min-w-0 flex-1">
        {/* Status bar and Save action */}
        <div className="border-line bg-paper-raised mb-4 flex items-center justify-between rounded-lg border px-4 py-2.5">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                isDirty ? "bg-highlight" : "bg-teal"
              }`}
              aria-hidden="true"
            />
            <span className="text-ink-soft font-medium">
              {isDirty ? "Unsaved changes" : "Saved"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty && !isNew}
            className="bg-ink text-paper hover:bg-teal disabled:opacity-40 disabled:hover:bg-ink rounded-md px-4 py-1.5 text-sm font-medium transition-colors"
          >
            {isNew ? "Save draft" : "Save"}
          </button>
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled draft"
          aria-label="Draft title"
          className="font-display placeholder:text-ink-soft/75 w-full border-none bg-transparent text-2xl font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-sm"
        />
        <div className="text-ink-soft font-mono mt-1 mb-4 text-xs">
          {wordCount} word{wordCount === 1 ? "" : "s"}
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Start writing, or ask the AI panel for a first pass…"
          aria-label="Draft body"
          className="border-line bg-paper-raised placeholder:text-ink-soft/75 min-h-[50vh] w-full resize-y rounded-lg border p-4 text-[15px] leading-relaxed focus-visible:ring-2 focus-visible:ring-teal focus-visible:outline-none"
        />
      </div>

      {/* AI assist panel */}
      <aside
        className="border-line bg-highlight-soft h-fit w-full shrink-0 rounded-lg border p-4 lg:w-80"
        aria-label="AI assist panel"
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-sm font-semibold text-ink">AI assist</h2>
          <button
            type="button"
            onClick={() => setPanelOpen((v) => !v)}
            className="text-ink-soft font-mono text-xs underline-offset-2 hover:underline"
            aria-expanded={panelOpen}
          >
            {panelOpen ? "hide" : "show"}
          </button>
        </div>

        {panelOpen && (
          <AiChatPanel type={type} title={title} body={body} />
        )}
      </aside>
    </div>
  );
}


