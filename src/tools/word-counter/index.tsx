"use client";

import { useState } from "react";
import { Eraser } from "lucide-react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { ToolBackdrop } from "@/components/layout/ToolBackdrop";
import { toolBackdrops } from "@/lib/tool-backdrops";
import { Card } from "@/components/ui/Card";
import { ResultCard } from "@/components/ui/ResultCard";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { VerticalAdSlot } from "@/components/ui/AdSlot";
import { ToolExplainer } from "@/components/ui/ToolExplainer";
import { formatNumber } from "@/lib/format";
import { getToolBySlug } from "@/lib/tools-registry";
import { analyzeText, formatReadingTime } from "./logic";

export default function WordCounter() {
  const tool = getToolBySlug("word-counter")!;
  const [text, setText] = useState("");

  const stats = analyzeText(text);

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white">Your Text</p>
              <button
                type="button"
                onClick={() => setText("")}
                disabled={!text}
                className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-white/40 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Eraser className="h-3.5 w-3.5" />
                Clear
              </button>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your text here..."
              aria-label="Text to analyze"
              className="min-h-[320px] w-full resize-y rounded-md border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-accent/60 sm:text-base"
            />
          </div>

          <div className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
            <ResultCard
              heading="Words"
              value={<AnimatedNumber value={stats.words} />}
              rows={[
                { label: "Characters", value: formatNumber(stats.characters) },
                { label: "Characters (no spaces)", value: formatNumber(stats.charactersNoSpaces) },
                { label: "Sentences", value: formatNumber(stats.sentences) },
                { label: "Paragraphs", value: formatNumber(stats.paragraphs) },
                { label: "Reading Time", value: formatReadingTime(stats.readingTimeMinutes) },
              ]}
            />

            <VerticalAdSlot />
          </div>
        </div>
      </Card>

      <ToolExplainer>
        <p>
          Word count splits your text on whitespace, so hyphenated-words and numbers count as one word
          each. Sentences are detected by counting groups of text ending in a period, exclamation mark or
          question mark, and paragraphs are counted by blank lines — the same conventions most word
          processors use.
        </p>
        <p>
          Reading time assumes roughly 200 words per minute, the commonly cited average adult silent
          reading speed — treat it as a ballpark for blog posts or essays, not a precise measurement for
          your specific readers.
        </p>
      </ToolExplainer>
    </div>
  );
}
