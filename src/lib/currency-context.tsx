"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { formatNumber } from "./format";

export interface CurrencyOption {
  code: string;
  symbol: string;
  label: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "RUB", symbol: "₽", label: "Russian Ruble" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar" },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar" },
];

// Approximate INR -> currency rates, used only until live rates load (or if offline).
const FALLBACK_RATES: Record<string, number> = {
  INR: 1,
  USD: 0.0117,
  GBP: 0.0092,
  RUB: 0.98,
  EUR: 0.0108,
  JPY: 1.74,
  AUD: 0.018,
  CAD: 0.0161,
};

const STORAGE_KEY = "solve.currency.v1";

interface CurrencyContextValue {
  currency: string;
  setCurrency: (code: string) => void;
  symbol: string;
  isLive: boolean;
  loading: boolean;
  rateFromInr: number;
  toDisplay: (inrValue: number) => number;
  toInr: (displayValue: number) => number;
  format: (inrValue: number, decimals?: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState("INR");
  const [hydrated, setHydrated] = useState(false);
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore the saved preference client-side only, after mount, so SSR and
    // the first client render stay identical (avoids a hydration mismatch).
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && CURRENCIES.some((c) => c.code === saved)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrencyState(saved);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, currency);
  }, [currency, hydrated]);

  useEffect(() => {
    let cancelled = false;
    async function fetchRates() {
      try {
        const res = await fetch("/api/fx-rates");
        if (!res.ok) throw new Error("Request failed");
        // The proxy always returns USD-based rates; re-pivot to INR-based
        // rates (1 INR = X of currency) since that's what toDisplay/toInr assume.
        const data = (await res.json()) as { rates?: Record<string, number> };
        const usdToInr = data.rates?.INR;
        if (!cancelled && data.rates && usdToInr) {
          const inrBased = Object.fromEntries(
            Object.entries(data.rates).map(([code, usdRate]) => [code, usdRate / usdToInr])
          );
          setRates({ ...FALLBACK_RATES, ...inrBased, INR: 1 });
          setIsLive(true);
        }
      } catch {
        // keep fallback rates
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchRates();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<CurrencyContextValue>(() => {
    const option = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];
    const rateFromInr = rates[currency] ?? 1;
    const toDisplay = (inrValue: number) => inrValue * rateFromInr;
    const toInr = (displayValue: number) => (rateFromInr === 0 ? 0 : displayValue / rateFromInr);
    const format = (inrValue: number, decimals?: number) => {
      const displayValue = toDisplay(inrValue);
      const fractionDigits = decimals ?? (currency === "INR" || currency === "JPY" ? 0 : 2);
      return `${option.symbol}${formatNumber(displayValue, fractionDigits)}`;
    };

    return {
      currency,
      setCurrency: setCurrencyState,
      symbol: option.symbol,
      isLive,
      loading,
      rateFromInr,
      toDisplay,
      toInr,
      format,
    };
  }, [currency, rates, isLive, loading]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}
