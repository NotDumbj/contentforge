"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDrafts } from "@/lib/use-drafts";
import type { DraftType } from "@/lib/drafts";

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

  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [savedTitle, setSavedTitle] = useState(initialTitle);
  const [savedBody, setSavedBody] = useState(initialBody);

  useEffect(() => {
    if (isLoaded && existingDraft) {
      const loadedBody = existingDraft.body ?? existingDraft.excerpt ?? "";
      setTitle(existingDraft.title);
      setBody(loadedBody);
      setSavedTitle(existingDraft.title);
      setSavedBody(loadedBody);
    }
  }, [isLoaded, existingDraft]);

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

  async function requestSuggestion() {
    setIsGenerating(true);
    setApiError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, title, body }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error || "Failed to generate suggestion.");
      } else {
        setSuggestion(data.suggestion);
      }
    } catch (err) {
      console.error("Client fetch error:", err);
      setApiError("Network error: Could not reach the generation service.");
    } finally {
      setIsGenerating(false);
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
      {/* Draft pane */}
      <div className="min-w-0 flex-1">
        {/* Status bar and Save action */}
        <div className="border-line bg-paper-raised mb-4 flex items-center justify-between rounded-lg border px-4 py-2.5">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                isDirty ? "bg-highlight" : "bg-teal"
              }`}
              aria-hidden
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
          className="font-display placeholder:text-ink-soft/50 w-full border-none bg-transparent text-2xl font-semibold tracking-tight outline-none"
        />
        <div className="text-ink-soft font-mono mt-1 mb-4 text-xs">
          {wordCount} word{wordCount === 1 ? "" : "s"}
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Start writing, or ask the AI panel for a first pass…"
          aria-label="Draft body"
          className="border-line bg-paper-raised placeholder:text-ink-soft/60 min-h-[50vh] w-full resize-y rounded-lg border p-4 text-[15px] leading-relaxed outline-none focus-visible:outline-none"
        />
      </div>

      {/* AI assist panel */}
      <aside
        className="border-line bg-highlight-soft h-fit w-full shrink-0 rounded-lg border p-5 lg:w-72"
        aria-label="AI assist panel"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold">AI assist</h2>
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
          <div className="mt-4">
            <p className="text-ink-soft text-xs leading-relaxed">
              Powered by Gemini — asks the model for content-specific feedback
              tailored to your format.
            </p>
            <button
              type="button"
              onClick={requestSuggestion}
              disabled={isGenerating}
              className="bg-ink text-paper hover:bg-teal disabled:opacity-50 mt-4 w-full rounded-md px-3 py-2 text-sm font-medium transition-colors"
            >
              {isGenerating ? "Generating suggestion…" : "Suggest an edit"}
            </button>

            {apiError && (
              <div className="border-danger/40 bg-paper-raised text-danger mt-4 rounded-md border-l-4 p-3 text-xs leading-relaxed">
                <span className="font-semibold block mb-0.5">Error:</span>
                {apiError}
              </div>
            )}

            {suggestion && !apiError && (
              <div className="border-teal/40 bg-paper-raised mt-4 rounded-md border-l-4 p-3 text-sm leading-relaxed">
                <span className="text-teal font-mono block mb-1 text-[11px] uppercase font-medium">
                  Gemini suggestion:
                </span>
                {suggestion}
              </div>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}


