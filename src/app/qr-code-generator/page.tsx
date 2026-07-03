import type { Metadata } from "next";
import QrCodeGenerator from "@/tools/qr-code-generator";

export const metadata: Metadata = {
  title: "QR Code Generator",
  description: "Turn any text or URL into a downloadable QR code.",
};

export default function Page() {
  return <QrCodeGenerator />;
}
