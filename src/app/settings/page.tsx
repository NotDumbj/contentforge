import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your AI model connection and application preferences.",
};

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
        <label className="text-ink text-sm font-medium block" htmlFor="model-key">
          AI provider API key (Gemini)
        </label>
        <input
          id="model-key"
          type="password"
          disabled
          aria-disabled="true"
          placeholder="Set via GEMINI_API_KEY in your environment variables"
          className="border-line bg-paper text-ink-soft placeholder:text-ink-soft/75 mt-2 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-teal"
        />
        <p className="text-ink-soft mt-2 text-xs">
          Read from <code className="font-mono">GEMINI_API_KEY</code> on the server. Never exposed to browser scripts.
        </p>
      </div>
    </div>
  );
}
