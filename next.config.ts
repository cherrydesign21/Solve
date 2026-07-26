import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Consolidate SEO signals onto a single canonical host — without this,
      // www.dailysolve.app and dailysolve.app both serve identical content
      // with no redirect between them, which search engines can treat as
      // duplicate content.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.dailysolve.app" }],
        destination: "https://dailysolve.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
