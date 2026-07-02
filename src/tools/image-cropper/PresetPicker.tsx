"use client";

import clsx from "clsx";
import { groupPresetsByPlatform, type SocialPreset } from "./presets";

interface PresetPickerProps {
  presets: SocialPreset[];
  selectedId: string | null;
  onSelect: (preset: SocialPreset) => void;
}

export function PresetPicker({ presets, selectedId, onSelect }: PresetPickerProps) {
  const groups = groupPresetsByPlatform(presets);

  return (
    <div className="flex flex-col gap-5">
      {Object.entries(groups).map(([platform, items]) => (
        <div key={platform} className="flex flex-col gap-2.5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">{platform}</p>
          <div className="flex flex-wrap gap-2">
            {items.map((preset) => {
              const active = preset.id === selectedId;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onSelect(preset)}
                  className={clsx(
                    "flex flex-col items-start gap-0.5 rounded-lg border px-3.5 py-2.5 text-left transition-colors duration-200",
                    active
                      ? "border-accent bg-accent/10 text-white"
                      : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/25 hover:text-white"
                  )}
                >
                  <span className="text-sm font-medium">{preset.label}</span>
                  <span className={clsx("text-xs", active ? "text-accent" : "text-white/35")}>
                    {preset.width} × {preset.height}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
