export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FaceBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const ASPECT_OPTIONS = [
  { id: "1:1", label: "1:1", value: 1 },
  { id: "4:3", label: "4:3", value: 4 / 3 },
  { id: "3:2", label: "3:2", value: 3 / 2 },
  { id: "16:9", label: "16:9", value: 16 / 9 },
  { id: "9:16", label: "9:16", value: 9 / 16 },
] as const;

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load that image."));
    image.src = src;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not export the image."))),
      type,
      quality
    );
  });
}

/** Draws `crop` (source-image pixel rect) from `image`, rotated, into a canvas sized
 * to outputWidth x outputHeight (defaults to the crop's own size), and returns a Blob. */
export async function exportCroppedImage(
  image: HTMLImageElement,
  crop: PixelCrop,
  rotationDeg = 0,
  outputWidth?: number,
  outputHeight?: number,
  mimeType = "image/png"
): Promise<Blob> {
  const targetWidth = Math.round(outputWidth ?? crop.width);
  const targetHeight = Math.round(outputHeight ?? crop.height);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas isn't supported in this browser.");

  if (rotationDeg % 360 === 0) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, targetWidth, targetHeight);
    return canvasToBlob(canvas, mimeType, 0.92);
  }

  // Rotate the full image onto an intermediate canvas first, then crop from that.
  const radians = (rotationDeg * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  const rotatedWidth = image.width * cos + image.height * sin;
  const rotatedHeight = image.width * sin + image.height * cos;

  const rotatedCanvas = document.createElement("canvas");
  rotatedCanvas.width = rotatedWidth;
  rotatedCanvas.height = rotatedHeight;
  const rotatedCtx = rotatedCanvas.getContext("2d");
  if (!rotatedCtx) throw new Error("Canvas isn't supported in this browser.");
  rotatedCtx.translate(rotatedWidth / 2, rotatedHeight / 2);
  rotatedCtx.rotate(radians);
  rotatedCtx.drawImage(image, -image.width / 2, -image.height / 2);

  canvas.width = targetWidth;
  canvas.height = targetHeight;
  ctx.drawImage(rotatedCanvas, crop.x, crop.y, crop.width, crop.height, 0, 0, targetWidth, targetHeight);
  return canvasToBlob(canvas, mimeType, 0.92);
}

export function centeredCropRect(imageWidth: number, imageHeight: number, aspect: number): PixelCrop {
  let width = imageWidth;
  let height = width / aspect;
  if (height > imageHeight) {
    height = imageHeight;
    width = height * aspect;
  }
  return { x: (imageWidth - width) / 2, y: (imageHeight - height) / 2, width, height };
}

/** Computes a crop rect (in source-image pixel coordinates) of the given aspect ratio,
 * generously padded around the detected face so the crop reads as a natural portrait
 * (head + shoulders), not a tight face-only box. Falls back to a geometric center crop
 * when no face was found. */
export function computeSubjectCropRect(
  imageWidth: number,
  imageHeight: number,
  face: FaceBox | null,
  aspect: number
): PixelCrop {
  if (!face) return centeredCropRect(imageWidth, imageHeight, aspect);

  const faceCenterX = face.x + face.width / 2;
  const faceCenterY = face.y + face.height / 2;
  const faceSize = Math.max(face.width, face.height);

  const PADDING_MULTIPLIER = 2.6;
  let height = faceSize * PADDING_MULTIPLIER;
  let width = height * aspect;

  if (width > imageWidth) {
    width = imageWidth;
    height = width / aspect;
  }
  if (height > imageHeight) {
    height = imageHeight;
    width = height * aspect;
  }

  let x = faceCenterX - width / 2;
  let y = faceCenterY - height * 0.42; // face slightly above vertical center (portrait convention)

  x = Math.min(Math.max(x, 0), imageWidth - width);
  y = Math.min(Math.max(y, 0), imageHeight - height);

  return { x, y, width, height };
}

export function scaledDimensions(width: number, height: number, maxSize: number): { width: number; height: number } {
  if (width <= maxSize && height <= maxSize) return { width, height };
  const scale = Math.min(maxSize / width, maxSize / height);
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export { downloadBlob } from "@/lib/download";

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
