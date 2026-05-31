import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL || "https://github.com/chayprabs/pdf-visual-diff-online";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/privacy",
    "/terms",
    "/pdf-compare",
    "/pdf-visual-diff",
    "/pdf-text-diff",
    "/pdf-signature-check",
    "/pdf-regression-test",
  ];
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
