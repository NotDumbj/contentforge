import { headers } from "next/headers";

export const dynamic = "force-dynamic";

type HealthResponse = {
  status: string;
  service: string;
  uptimeSeconds: number;
  timestamp: string;
};

async function getOrigin() {
  const h = await headers();
  const host = h.get("host");
  const protocol = h.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}`;
}

async function getHealth() {
  try {
    const origin = await getOrigin();
    const res = await fetch(`${origin}/api/health`, { cache: "no-store" });
    if (!res.ok) return { ok: false as const, error: `API responded ${res.status}` };
    const data = (await res.json()) as HealthResponse;
    return { ok: true as const, data };
  } catch {
    return { ok: false as const, error: "Could not reach the health API route." };
  }
}

export default async function HealthPage() {
  const result = await getHealth();

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-teal font-mono text-xs tracking-wide uppercase">System</p>
      <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight">
        Health check
      </h1>
      <p className="text-ink-soft mt-2 text-sm">
        This page fetches <code className="font-mono">/api/health</code> on
        every request, confirming the server is up and rendering live data —
        not a build-time placeholder.
      </p>

      <div className="border-line bg-paper-raised mt-8 rounded-lg border p-5">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${result.ok ? "bg-teal" : "bg-danger"}`}
            aria-hidden="true"
          />
          <span className="font-mono text-sm font-medium">
            {result.ok ? "OK — fetch succeeded" : "Fetch failed"}
          </span>
        </div>

        {result.ok ? (
          <dl className="font-mono mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="text-ink-soft">service</dt>
            <dd>{result.data.service}</dd>
            <dt className="text-ink-soft">status</dt>
            <dd>{result.data.status}</dd>
            <dt className="text-ink-soft">uptime</dt>
            <dd>{result.data.uptimeSeconds}s</dd>
            <dt className="text-ink-soft">server time</dt>
            <dd>{result.data.timestamp}</dd>
          </dl>
        ) : (
          <p className="text-danger font-mono mt-4 text-sm">{result.error}</p>
        )}
      </div>
    </div>
  );
}
