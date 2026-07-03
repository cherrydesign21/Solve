import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Solve — Everyday Calculators & Converters",
    short_name: "Solve",
    description:
      "A fast, mobile-friendly collection of everyday calculators and converters: EMI, SIP, tax, currency, units, solar sizing and more.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
