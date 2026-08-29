import { drafts } from "@/lib/drafts";

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-teal font-mono text-xs tracking-wide uppercase">History</p>
      <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight">
        Version history
      </h1>
      <p className="text-ink-soft mt-2 max-w-prose text-sm">
        Every save will land here once versioning is wired up in the Build
        phase. For now, this lists current drafts and their last update.
      </p>

      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-line text-ink-soft font-mono border-b text-xs uppercase">
            <th className="py-2 font-medium">Draft</th>
            <th className="py-2 font-medium">Status</th>
            <th className="py-2 font-medium">Updated</th>
          </tr>
        </thead>
        <tbody>
          {drafts.map((d) => (
            <tr key={d.id} className="border-line border-b">
              <td className="py-3 pr-4">{d.title}</td>
              <td className="text-ink-soft py-3 pr-4">{d.status}</td>
              <td className="text-ink-soft font-mono py-3">{d.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
