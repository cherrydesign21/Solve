"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { AdsenseSettings } from "./settings";

const AdSettingsContext = createContext<AdsenseSettings>({
  enabled: false,
  publisherId: "",
  horizontalSlotId: "",
  verticalSlotId: "",
});

export function AdSettingsProvider({ value, children }: { value: AdsenseSettings; children: ReactNode }) {
  return <AdSettingsContext.Provider value={value}>{children}</AdSettingsContext.Provider>;
}

export function useAdSettings(): AdsenseSettings {
  return useContext(AdSettingsContext);
}
