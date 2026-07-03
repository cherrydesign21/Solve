export type QrLevel = "L" | "M" | "Q" | "H";

export const levelOptions: { value: QrLevel; label: string }[] = [
  { value: "L", label: "Low" },
  { value: "M", label: "Medium" },
  { value: "Q", label: "Quartile" },
  { value: "H", label: "High" },
];

export function qrFilename(value: string): string {
  const safe = value
    .trim()
    .slice(0, 40)
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return `${safe.length > 0 ? safe : "qr-code"}.png`;
}
