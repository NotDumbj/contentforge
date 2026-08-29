const TEMPLATES = [
  { name: "How-to blog post", type: "Blog post", desc: "Problem → steps → recap structure." },
  { name: "Product launch caption", type: "Social caption", desc: "Hook, feature, call to action." },
  { name: "60-second explainer", type: "Video script", desc: "Hook, three beats, single CTA." },
  { name: "Weekly roundup", type: "Blog post", desc: "Curated links with one-line takes." },
];

export default function TemplatesPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-teal font-mono text-xs tracking-wide uppercase">Templates</p>
      <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight">
        Prompt &amp; template library
      </h1>
      <p className="text-ink-soft mt-2 max-w-prose text-sm">
        Starting points the AI panel uses to shape a first draft. Real templates
        and prompt editing land in the Build phase — these are placeholders.
      </p>

      <ul className="mt-8 divide-y divide-line border-y border-line">
        {TEMPLATES.map((t) => (
          <li key={t.name} className="flex items-center justify-between gap-4 py-4">
            <div>
              <h2 className="font-display text-base font-semibold">{t.name}</h2>
              <p className="text-ink-soft mt-1 text-sm">{t.desc}</p>
            </div>
            <span className="font-mono text-ink-soft shrink-0 text-xs">{t.type}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
