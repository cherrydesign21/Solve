import { downloadBlob } from "@/lib/download";

// The slip is authored at 96 CSS px/inch (see A4_WIDTH_PX/A4_HEIGHT_PX in
// SlipPreview.tsx); scale up to ~300dpi for print-quality JPG/PDF output.
const PRINT_SCALE = 300 / 96;

async function captureNode(node: HTMLElement) {
  const { default: html2canvas } = await import("html2canvas");
  return html2canvas(node, { scale: PRINT_SCALE, backgroundColor: "#ffffff", useCORS: true });
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
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Fit the captured page to A4 while preserving its aspect ratio — this
  // fills the page edge-to-edge in the common case (the source node is
  // already A4-shaped), and letterboxes gracefully if unusually long input
  // ever makes the slip taller than one page, rather than clipping or
  // distorting it.
  const imgAspect = canvas.height / canvas.width;
  let renderWidth = pageWidth;
  let renderHeight = renderWidth * imgAspect;
  if (renderHeight > pageHeight) {
    renderHeight = pageHeight;
    renderWidth = renderHeight / imgAspect;
  }
  const x = (pageWidth - renderWidth) / 2;

  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  pdf.addImage(imgData, "JPEG", x, 0, renderWidth, renderHeight);
  pdf.save(filename);
}
