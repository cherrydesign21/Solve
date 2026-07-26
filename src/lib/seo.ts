import type { Metadata } from "next";
import { getToolBySlug } from "./tools-registry";

export const SITE_URL = "https://dailysolve.app";
export const SITE_NAME = "DailySolve";

interface BuildMetadataInput {
  title: string;
  description: string;
  path: string;
}

// Note: Google has ignored the keywords meta tag for ranking since 2009 —
// this exists for completeness/other crawlers, not as an SEO lever. Derived
// automatically from the tools registry so every tool page gets sensible
// keywords without having to hand-author 30+ lists.
function buildKeywords(title: string, path: string): string[] {
  const tool = getToolBySlug(path.replace(/^\//, ""));
  const base = tool
    ? [tool.name, tool.shortName, tool.category, "free", "online", "calculator"]
    : [title, "DailySolve"];
  return Array.from(new Set(base.map((k) => k.trim()).filter(Boolean)));
}

export function buildMetadata({ title, description, path }: BuildMetadataInput): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;

  return {
    title,
    description,
    keywords: buildKeywords(title, path),
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      // Defining our own openGraph object here replaces (not merges with) the
      // root layout's — including its auto-detected opengraph-image — so the
      // image must be referenced explicitly on every page.
      images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/twitter-image`],
    },
  };
}
