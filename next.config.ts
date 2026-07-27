import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Server Actions check the request's Origin against the detected host
      // to prevent CSRF — Next.js doesn't automatically know about a custom
      // domain layered on top of the Vercel deployment, so without this,
      // every Server Action (e.g. the admin settings forms) silently fails
      // to complete when the site is visited via dailysolve.app.
      allowedOrigins: ["dailysolve.app", "www.dailysolve.app"],
    },
  },
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
