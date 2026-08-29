import Link from "next/link";
import { notFound } from "next/navigation";
import { getDraft, TYPE_LABEL, type DraftType } from "@/lib/drafts";
import { EditorWorkspace } from "@/components/editor-workspace";

const NEW_TYPES: DraftType[] = ["blog", "social", "video"];

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fresh drafts are routed here as "new-<type>" from /editor/new.
  if (id.startsWith("new-")) {
    const type = id.replace("new-", "") as DraftType;
    if (!NEW_TYPES.includes(type)) notFound();
    return (
      <div className="mx-auto max-w-5xl">
        <Breadcrumb label={`New ${TYPE_LABEL[type].toLowerCase()}`} />
        <EditorWorkspace type={type} initialTitle="" initialBody="" />
      </div>
    );
  }

  const draft = getDraft(id);
  if (!draft) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      <Breadcrumb label={draft.title} />
      <EditorWorkspace
        type={draft.type}
        initialTitle={draft.title}
        initialBody={draft.excerpt}
      />
    </div>
  );
}

function Breadcrumb({ label }: { label: string }) {
  return (
    <div className="text-ink-soft font-mono mb-6 text-xs">
      <Link href="/" className="hover:text-teal underline-offset-2 hover:underline">
        Dashboard
      </Link>
      <span className="mx-2">/</span>
      <span>{label}</span>
    </div>
  );
}
