import Link from "next/link";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/editor/new", label: "New draft" },
  { href: "/templates", label: "Templates" },
  { href: "/history", label: "History" },
  { href: "/settings", label: "Settings" },
];

export function SidebarNav() {
  return (
    <nav
      aria-label="Primary"
      className="border-line bg-paper-raised flex shrink-0 flex-col gap-1 border-b p-3 md:h-full md:w-56 md:border-r md:border-b-0 md:p-5"
    >
      <div className="mb-2 flex items-baseline justify-between md:block">
        <span className="font-display text-ink text-lg md:text-xl font-semibold tracking-tight">
          ContentForge
        </span>
        <span className="text-ink-soft font-mono ml-2 md:ml-0 md:mt-1 md:block text-xs">
          draft studio
        </span>
      </div>
      <ul className="flex flex-row flex-wrap gap-1 md:flex-col">
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-ink hover:bg-highlight-soft focus-visible:bg-highlight-soft block rounded-md px-3 py-2 text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
