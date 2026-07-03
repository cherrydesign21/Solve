import type { Metadata } from "next";
import QrCodeGenerator from "@/tools/qr-code-generator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "QR Code Generator",
  description: "Turn any text or URL into a downloadable QR code.",
  path: "/qr-code-generator",
});

export default function Page() {
  return <QrCodeGenerator />;
}
