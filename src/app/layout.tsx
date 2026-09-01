import type { Metadata } from "next";
import { SidebarNav } from "@/components/sidebar-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "ContentForge",
  description: "An AI-assisted studio for drafting blog posts, social captions, and video scripts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="font-sans text-ink min-h-full">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-highlight focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-medium focus:text-ink focus:shadow-md focus:outline-none"
        >
          Skip to main content
        </a>
        <div className="flex min-h-screen flex-col md:flex-row">
          <SidebarNav />
          <main id="main-content" tabIndex={-1} className="flex-1 p-4 md:p-8 focus:outline-none">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
