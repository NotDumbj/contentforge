import Link from "next/link";
import { notFound } from "next/navigation";
import { getDraft, TYPE_LABEL, type DraftType } from "@/lib/drafts";
import { getTemplate } from "@/lib/templates";
import { EditorWorkspace } from "@/components/editor-workspace";

const NEW_TYPES: DraftType[] = ["blog", "social", "video"];

export default async function EditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ template?: string }>;
}) {
  const { id } = await params;
  const { template: templateId } = await searchParams;

  // Fresh drafts are routed here as "new-<type>" from /editor/new or /templates.
  if (id.startsWith("new-")) {
    const type = id.replace("new-", "") as DraftType;
    if (!NEW_TYPES.includes(type)) notFound();

    const template = getTemplate(templateId);
    const initialTitle = template ? template.name : "";
    const initialBody = template ? template.starterBody : "";

    return (
      <div className="mx-auto max-w-5xl">
        <Breadcrumb
          label={
            template
              ? template.name
              : `New ${TYPE_LABEL[type].toLowerCase()}`
          }
        />
        <EditorWorkspace
          draftId={id}
          type={type}
          initialTitle={initialTitle}
          initialBody={initialBody}
        />
      </div>
    );
  }

  const draft = getDraft(id);

  return (
    <div className="mx-auto max-w-5xl">
      <Breadcrumb label={draft ? draft.title : "Edit draft"} />
      <EditorWorkspace
        draftId={id}
        type={draft?.type ?? "blog"}
        initialTitle={draft?.title ?? ""}
        initialBody={draft?.body ?? draft?.excerpt ?? ""}
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
