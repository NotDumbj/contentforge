import type { Metadata } from "next";
import { SidebarNav } from "@/components/sidebar-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "ContentForge",
  description: "An AI-assisted studio for drafting blog posts, social captions, and video scripts.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="font-sans text-ink min-h-full">
        <div className="flex min-h-screen flex-col md:flex-row">
          <SidebarNav />
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
