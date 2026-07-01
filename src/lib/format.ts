export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function formatIndianCurrency(value: number, withSymbol = true): string {
  const rounded = Math.round(value);
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(rounded);
  return withSymbol ? `₹${formatted}` : formatted;
}

export function formatNumber(value: number, fractionDigits = 0): string {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatCurrency(
  value: number,
  currency: string,
  locale = "en-US",
  fractionDigits = 2
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(value);
  } catch {
    return `${value.toFixed(fractionDigits)} ${currency}`;
  }
}

export function humanizeAmountCaption(value: number): string {
  if (value >= 1_00_00_000) {
    const v = value / 1_00_00_000;
    return `${Number.isInteger(v) ? v : v.toFixed(1)} Cr`;
  }
  if (value >= 1_00_000) {
    const v = value / 1_00_000;
    return `${Number.isInteger(v) ? v : v.toFixed(1)} Lac`;
  }
  if (value >= 1_000) {
    const v = value / 1_000;
    return `${Number.isInteger(v) ? v : v.toFixed(1)}K`;
  }
  return formatNumber(value);
}

export function humanizeIndianAmount(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_00_00_000) return `${(value / 1_00_00_000).toFixed(2)} Cr`;
  if (abs >= 1_00_000) return `${(value / 1_00_000).toFixed(2)} Lac`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(2)} K`;
  return `${value}`;
}
