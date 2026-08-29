export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-teal font-mono text-xs tracking-wide uppercase">Settings</p>
      <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight">
        Preferences
      </h1>
      <p className="text-ink-soft mt-2 max-w-prose text-sm">
        Model connection and preferences. The key below is read from an
        environment variable — never stored in the browser or the repo.
      </p>

      <div className="border-line bg-paper-raised mt-8 rounded-lg border p-5">
        <label className="text-ink text-sm font-medium" htmlFor="model-key">
          AI provider API key
        </label>
        <input
          id="model-key"
          type="password"
          disabled
          placeholder="Set via OPENAI_API_KEY in your deployment's environment variables"
          className="border-line bg-paper text-ink-soft placeholder:text-ink-soft mt-2 w-full rounded-md border px-3 py-2 text-sm"
        />
        <p className="text-ink-soft mt-2 text-xs">
          Placeholder field — wiring this up to a real provider is Build-phase
          work.
        </p>
      </div>
    </div>
  );
}
