import type { Metadata } from "next";
import Link from "next/link";
import { TEMPLATES } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Browse prompt templates and starter skeletons for blog posts, social captions, and video scripts.",
};

export default function TemplatesPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-teal font-mono text-xs tracking-wide uppercase">Templates</p>
      <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight">
        Prompt &amp; template library
      </h1>
      <p className="text-ink-soft mt-2 max-w-prose text-sm">
        Select a starting point below to open a pre-filled draft in the editor
        with the AI assist panel ready.
      </p>

      <ul className="mt-8 divide-y divide-line border-y border-line">
        {TEMPLATES.map((t) => (
          <li key={t.id}>
            <Link
              href={`/editor/new-${t.type}?template=${t.id}`}
              className="group flex items-center justify-between gap-4 py-4 transition-colors hover:bg-highlight-soft/50 px-2 rounded-md"
            >
              <div>
                <h2 className="font-display text-base font-semibold group-hover:text-teal transition-colors flex items-center gap-2">
                  {t.name}
                  <span className="text-teal text-sm transition-transform group-hover:translate-x-1 font-mono">
                    →
                  </span>
                </h2>
                <p className="text-ink-soft mt-1 text-sm">{t.desc}</p>
              </div>
              <span className="font-mono text-ink-soft shrink-0 text-xs">
                {t.typeLabel}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

