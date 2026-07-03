import type { Metadata } from "next";
import ImageCropper from "@/tools/image-cropper";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Image Cropper",
  description: "Crop images manually, or auto-generate perfectly sized, subject-centered social media assets.",
  path: "/image-cropper",
});

export default function Page() {
  return <ImageCropper />;
}
