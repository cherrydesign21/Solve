"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight, Pencil } from "lucide-react";
import clsx from "clsx";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { ToolBackdrop } from "@/components/layout/ToolBackdrop";
import { toolBackdrops } from "@/lib/tool-backdrops";
import { Card } from "@/components/ui/Card";
import { ToolExplainer } from "@/components/ui/ToolExplainer";
import { SelectField } from "@/components/ui/SelectField";
import { NumberField } from "@/components/ui/NumberField";
import { getToolBySlug } from "@/lib/tools-registry";
import { convert, smartDecimals, unitCategories } from "./logic";

export default function UnitConverter() {
  const tool = getToolBySlug("unit-converter")!;
  const [category, setCategory] = useState(unitCategories[0]);
  const [fromId, setFromId] = useState(category.units[0].id);
  const [toId, setToId] = useState(category.units[2]?.id ?? category.units[1].id);
  const [fromValue, setFromValue] = useState(1);

  const toValue = convert(fromValue, category, fromId, toId);

  const handleCategoryChange = (nextId: string) => {
    const next = unitCategories.find((c) => c.id === nextId);
    if (!next) return;
    setCategory(next);
    setFromId(next.units[0].id);
    setToId(next.units[2]?.id ?? next.units[1].id);
    setFromValue(1);
  };

  const handleToChange = (nextToValue: number) => {
    setFromValue(convert(nextToValue, category, toId, fromId));
  };

  const handleSwap = () => {
    setFromId(toId);
    setToId(fromId);
    setFromValue(toValue);
  };

  const unitOptions = category.units.map((u) => ({ value: u.id, label: u.label }));

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="p-5 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-8 sm:gap-10">
          <div
            className="flex gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            {unitCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={clsx(
                  "shrink-0 rounded-full px-4 py-2.5 text-xs font-medium uppercase tracking-wide transition-colors duration-200 sm:text-sm",
                  cat.id === category.id ? "bg-accent text-black" : "bg-white/10 text-white/60 hover:text-white"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-center lg:gap-6">
            <div className="flex flex-1 flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">From</p>
                <p className="flex items-center gap-1 text-[11px] text-white/30">
                  <Pencil className="h-3 w-3" /> Enter a value
                </p>
              </div>
              <SelectField options={unitOptions} value={fromId} onChange={setFromId} ariaLabel="From unit" />
              <NumberField
                value={fromValue}
                onChange={setFromValue}
                decimals={smartDecimals(fromValue)}
                ariaLabel="From value"
                className="!border-0 !bg-transparent !px-0 !py-1 focus-within:ring-1 focus-within:ring-accent/40 rounded-md"
                inputClassName="text-2xl sm:text-3xl font-semibold"
              />
            </div>

            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap units"
              className="mx-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all duration-300 hover:border-accent/50 hover:text-accent lg:rotate-0"
            >
              <motion.span whileTap={{ rotate: 180 }} className="flex">
                <ArrowLeftRight className="h-5 w-5" />
              </motion.span>
            </button>

            <div className="flex flex-1 flex-col gap-3 rounded-xl border border-accent/30 bg-accent/[0.06] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent/80">To</p>
                <p className="flex items-center gap-1 text-[11px] text-white/30">
                  <Pencil className="h-3 w-3" /> Also editable
                </p>
              </div>
              <SelectField options={unitOptions} value={toId} onChange={setToId} ariaLabel="To unit" />
              <NumberField
                value={toValue}
                onChange={handleToChange}
                decimals={smartDecimals(toValue)}
                ariaLabel="To value"
                className="!border-0 !bg-transparent !px-0 !py-1 focus-within:ring-1 focus-within:ring-accent/40 rounded-md"
                inputClassName="text-2xl sm:text-3xl font-semibold"
              />
            </div>
          </div>
        </div>
      </Card>

      <ToolExplainer>
        <p>
          Every unit within a category converts through a fixed base unit — for length, everything routes
          through metres; for weight, kilograms — so converting kilometres to miles is really two steps
          under the hood: kilometres to metres, then metres to miles.
        </p>
        <p>
          Both fields are live and editable, so you can type into either side and the other updates
          instantly — useful for checking a conversion in reverse without hunting for a separate
          calculator.
        </p>
      </ToolExplainer>
    </div>
  );
}
