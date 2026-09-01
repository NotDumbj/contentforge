# Changelog - ContentForge

All notable changes to ContentForge since the initial Foundations skeleton.

## [0.2.0] - 2026-09-01

### Added
- **Client-Side Draft Persistence**: Created `useDrafts` custom hook (`src/lib/use-drafts.ts`) for browser-only `localStorage` CRUD operations under key `"contentforge:drafts"`, auto-seeded on first run.
- **Save & Status Action**: Added explicit "Save" action button in `EditorWorkspace` with real-time status indicators ("Saved" vs "Unsaved changes").
- **Gemini AI Assist Integration**: Connected AI assist panel to a server-side Next.js Route Handler (`POST /api/generate`) using `GEMINI_API_KEY` (`gemini-2.5-flash`). Scoped prompt templates by content type (`blog`, `social`, `video`).
- **Connected Template Library**: Wired `/templates` to the editor. Template cards link to `/editor/new-<type>?template=<id>` pre-filling starter skeletons (`how-to-blog`, `product-launch`, `60s-explainer`, `weekly-roundup`).
- **Baseline SEO & Open Graph Cards**: Added root layout metadataBase, Open Graph/Twitter social sharing cards, dynamic title templates (`%s | ContentForge`), and dynamic route metadata.
- **Robots & Sitemap Generation**: Added `src/app/robots.ts` (`/robots.txt`) and `src/app/sitemap.ts` (`/sitemap.xml`).
- **Skip to Content Link**: Added `"Skip to main content"` as first focusable element in `src/app/layout.tsx` for accessibility.

### Changed
- **WCAG 2.1 AA Color Contrast**: Refined `--color-ink-soft` (`#484d45`) and `--color-teal` (`#165b51`) in `globals.css` to achieve 6.4+:1 contrast ratios. Replaced translucent text placeholders with high-contrast text tokens.
- **Client Component Architecture**: Extracted `DashboardView` and `HistoryView` client islands so top-level page files (`src/app/page.tsx` and `src/app/history/page.tsx`) remain Server Components exporting route metadata.
- **Responsive Layout Adjustments**: Added mobile brand header (`ContentForge draft studio`) at 375px breakpoint and horizontal scroll wrapper for version history table.

### Fixed
- Fixed textarea focus outline suppression by applying explicit `focus-visible:ring-2 focus-visible:ring-teal` focus rings.
- Fixed missing screen reader heading by injecting `h1` in `EditorWorkspace`.
