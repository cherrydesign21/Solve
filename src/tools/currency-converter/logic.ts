export const CURRENCY_NAMES: Record<string, string> = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  INR: "Indian Rupee",
  JPY: "Japanese Yen",
  AUD: "Australian Dollar",
  CAD: "Canadian Dollar",
  CHF: "Swiss Franc",
  CNY: "Chinese Yuan",
  SGD: "Singapore Dollar",
  NZD: "New Zealand Dollar",
  ZAR: "South African Rand",
  MXN: "Mexican Peso",
  BRL: "Brazilian Real",
  KRW: "South Korean Won",
};

// Approximate rates relative to USD, used only until live rates load (or if offline).
export const FALLBACK_BASE = "USD";
export const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 85.5,
  JPY: 148.5,
  AUD: 1.53,
  CAD: 1.37,
  CHF: 0.81,
  CNY: 7.18,
  SGD: 1.29,
  NZD: 1.65,
  ZAR: 17.8,
  MXN: 18.5,
  BRL: 5.4,
  KRW: 1360,
};

export const currencyList = Object.keys(FALLBACK_RATES);

export function convertCurrency(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>,
  base: string
): number {
  if (!Number.isFinite(amount)) return 0;
  if (from === to) return amount;
  const rateFrom = from === base ? 1 : rates[from];
  const rateTo = to === base ? 1 : rates[to];
  if (!rateFrom || !rateTo) return NaN;
  const valueInBase = amount / rateFrom;
  return valueInBase * rateTo;
}
