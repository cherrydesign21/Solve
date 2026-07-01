"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight } from "lucide-react";
import clsx from "clsx";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { Card } from "@/components/ui/Card";
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
    <div>
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
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">From</p>
              <SelectField options={unitOptions} value={fromId} onChange={setFromId} ariaLabel="From unit" />
              <NumberField
                value={fromValue}
                onChange={setFromValue}
                decimals={smartDecimals(fromValue)}
                ariaLabel="From value"
                className="!bg-transparent !border-0 !px-0 !py-1"
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
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent/80">To</p>
              <SelectField options={unitOptions} value={toId} onChange={setToId} ariaLabel="To unit" />
              <NumberField
                value={toValue}
                onChange={handleToChange}
                decimals={smartDecimals(toValue)}
                ariaLabel="To value"
                className="!bg-transparent !border-0 !px-0 !py-1"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
