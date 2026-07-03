"use client";

import { useRef, useState } from "react";
import { Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { ToolBackdrop } from "@/components/layout/ToolBackdrop";
import { toolBackdrops } from "@/lib/tool-backdrops";
import { Card } from "@/components/ui/Card";
import { TextField } from "@/components/ui/TextField";
import { SliderField } from "@/components/ui/SliderField";
import { Tabs } from "@/components/ui/Tabs";
import { VerticalAdSlot } from "@/components/ui/AdSlot";
import { downloadBlob } from "@/lib/download";
import { getToolBySlug } from "@/lib/tools-registry";
import { levelOptions, qrFilename, type QrLevel } from "./logic";

export default function QrCodeGenerator() {
  const tool = getToolBySlug("qr-code-generator")!;
  const [value, setValue] = useState("https://solve-lac.vercel.app");
  const [size, setSize] = useState(240);
  const [level, setLevel] = useState<QrLevel>("M");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const content = value.trim().length > 0 ? value : " ";

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, qrFilename(value));
    }, "image/png");
  };

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div className="flex flex-col gap-8 sm:gap-10">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-white">Text or URL</p>
              <TextField
                value={value}
                onChange={setValue}
                placeholder="https://example.com"
                aria-label="Text or URL to encode"
              />
            </div>

            <SliderField
              label="Size"
              value={size}
              min={128}
              max={512}
              step={8}
              onChange={setSize}
              suffix="px"
              minCaption="128 px"
              maxCaption="512 px"
            />

            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-white">Error Correction</p>
              <Tabs options={levelOptions} value={level} onChange={setLevel} />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-white">Foreground</p>
                <div className="flex items-center gap-3 rounded-md border border-white/15 bg-white/[0.06] px-4 py-2.5">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    aria-label="Foreground color"
                    className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent"
                  />
                  <span className="text-sm uppercase text-white/60">{fgColor}</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-white">Background</p>
                <div className="flex items-center gap-3 rounded-md border border-white/15 bg-white/[0.06] px-4 py-2.5">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    aria-label="Background color"
                    className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent"
                  />
                  <span className="text-sm uppercase text-white/60">{bgColor}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-col items-center gap-6 rounded-xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
              <div className="flex items-center justify-center rounded-lg bg-white p-4">
                <QRCodeCanvas
                  ref={canvasRef}
                  value={content}
                  size={size}
                  level={level}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  marginSize={2}
                />
              </div>
              <button
                type="button"
                onClick={handleDownload}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
              >
                <Download className="h-4 w-4" />
                Download PNG
              </button>
            </div>

            <VerticalAdSlot />
          </div>
        </div>
      </Card>
    </div>
  );
}
