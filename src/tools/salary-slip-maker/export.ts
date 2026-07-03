import { downloadBlob } from "@/lib/download";

async function captureNode(node: HTMLElement) {
  const { default: html2canvas } = await import("html2canvas");
  return html2canvas(node, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
}

export async function exportNodeAsJpg(node: HTMLElement, filename: string): Promise<void> {
  const canvas = await captureNode(node);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.95));
  if (!blob) throw new Error("Could not export the image.");
  downloadBlob(blob, filename);
}

export async function exportNodeAsPdf(node: HTMLElement, filename: string): Promise<void> {
  const canvas = await captureNode(node);
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({
    orientation: canvas.width >= canvas.height ? "landscape" : "portrait",
    unit: "px",
    format: [canvas.width, canvas.height],
  });
  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
  pdf.save(filename);
}
