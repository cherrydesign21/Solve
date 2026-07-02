import type { Metadata } from "next";
import ImageCropper from "@/tools/image-cropper";

export const metadata: Metadata = {
  title: "Image Cropper",
  description: "Crop images manually, or auto-generate perfectly sized, subject-centered social media assets.",
};

export default function Page() {
  return <ImageCropper />;
}
