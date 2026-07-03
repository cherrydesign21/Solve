import type { Metadata } from "next";

export const SITE_URL = "https://solve-lac.vercel.app";
export const SITE_NAME = "Solve";

interface BuildMetadataInput {
  title: string;
  description: string;
  path: string;
}

export function buildMetadata({ title, description, path }: BuildMetadataInput): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;

  return {
    title,
    description,
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
