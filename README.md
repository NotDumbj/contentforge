# ContentForge

An AI-assisted content studio for drafting blog posts, social captions, and
video scripts. This is the Week 3 **capstone skeleton**: routed placeholder
screens, a working editor UI, and a live health check — no AI provider wired
up yet (that's Build phase work).

## Screens

| Route | Purpose |
|---|---|
| `/` | Dashboard — list of drafts |
| `/editor/new` | Choose a draft type |
| `/editor/[id]` | Writing workspace + AI assist panel |
| `/templates` | Prompt/template library |
| `/history` | Draft version history |
| `/settings` | Preferences, API key placeholder |
| `/health` | Health check — fetches `/api/health` and renders it |

Server Components are the default throughout. The only Client Component is
`EditorWorkspace` (the textarea + AI panel), since that's the only screen
that needs interactivity.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy a preview (what the assignment asks for)

1. **Push this repo to GitHub.**
   ```bash
   git init
   git add .
   git commit -m "Capstone skeleton"
   git branch -M main
   git remote add origin <your-empty-github-repo-url>
   git push -u origin main
   ```
2. **Connect it to Vercel.**
   - Go to https://vercel.com/new, sign in, and import the GitHub repo.
   - Framework preset auto-detects as Next.js — leave defaults.
   - No environment variables are required for this skeleton to build and
     run (see `.env.example` for what's added later).
   - Click Deploy. Every push to `main` (and every PR) now gets its own
     preview URL automatically.
3. **Copy the preview URL** Vercel gives you and paste it, plus the repo
   link, into the assignment's submission section.

(Netlify works the same way via https://app.netlify.com/start — pick
"Next.js" and it detects the build command automatically.)

## Environment variables

None are required yet. `.env.example` documents the one variable the AI
panel will need once it's wired to a real model in the Build phase
(`OPENAI_API_KEY`). Copy it to `.env.local` for local dev only — never
commit real keys. In Vercel/Netlify, secrets go under the project's
Environment Variables settings, not in the repo.

## Design tokens

Colors, fonts, and spacing live as CSS variables in `src/app/globals.css`
(Tailwind v4's CSS-based theme, no `tailwind.config.js` needed). Palette:
paper/ink for structure, highlighter-yellow for anything AI-touched, teal
for interactive elements. Fonts are self-hosted via `@fontsource-variable`
packages (Fraunces for headings, Inter for body, JetBrains Mono for
metadata) so the build never depends on reaching Google Fonts.

## What's still a placeholder

- Draft data (`src/lib/drafts.ts`) is hardcoded, not a database.
- The AI assist panel returns a random canned suggestion, not a real model
  call.
- Templates and history are read-only mock lists.

All flagged inline in the UI copy so it's obvious what's real vs. scaffold.
