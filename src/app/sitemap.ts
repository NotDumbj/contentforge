import type { MetadataRoute } from "next";
import { TEMPLATES } from "@/lib/templates";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://contentforge.app";

  const mainRoutes = [
    "",
    "/editor/new",
    "/templates",
    "/history",
    "/settings",
    "/health",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const templateRoutes = TEMPLATES.map((t) => ({
    url: `${baseUrl}/editor/new-${t.type}?template=${t.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...mainRoutes, ...templateRoutes];
}
