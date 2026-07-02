"use client";

import { useEffect, useState } from "react";
import { ImageOff, RefreshCw } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { Card } from "@/components/ui/Card";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { ToolBackdrop } from "@/components/layout/ToolBackdrop";
import { toolBackdrops } from "@/lib/tool-backdrops";
import { getToolBySlug } from "@/lib/tools-registry";
import { ImageDropzone } from "./ImageDropzone";
import { CustomCropTab } from "./CustomCropTab";
import { SocialCropTab } from "./SocialCropTab";
import { loadImage } from "./logic";

type Mode = "custom" | "social";

const modeOptions: { value: Mode; label: string }[] = [
  { value: "custom", label: "Custom" },
  { value: "social", label: "Social Media" },
];

export default function ImageCropper() {
  const tool = getToolBySlug("image-cropper")!;
  const [mode, setMode] = useState<Mode>("custom");
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    // Exposing the freshly created object URL to render is the point of this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImageSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!imageSrc) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadError(null);
    loadImage(imageSrc)
      .then((img) => {
        if (!cancelled) setImage(img);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : "Could not load that image.");
      });
    return () => {
      cancelled = true;
    };
  }, [imageSrc]);

  const handleChangeImage = () => {
    setFile(null);
    setImageSrc(null);
    setImage(null);
    setLoadError(null);
  };

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops[tool.slug] ?? []} />
      <ToolHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <Card className="p-5 sm:p-8 lg:p-10">
        {!file && <ImageDropzone onFile={setFile} />}

        {file && !image && !loadError && (
          <div className="flex h-[300px] items-center justify-center text-sm text-white/40">Loading image…</div>
        )}

        {loadError && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <ImageOff className="h-8 w-8 text-red-400" />
            <p className="text-sm text-white/50">{loadError}</p>
            <button type="button" onClick={handleChangeImage} className="text-sm text-accent underline">
              Try another image
            </button>
          </div>
        )}

        {file && image && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Tabs options={modeOptions} value={mode} onChange={setMode} className="sm:max-w-xs" />
              <button
                type="button"
                onClick={handleChangeImage}
                className="flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Change image
              </button>
            </div>

            {mode === "custom" ? (
              <CustomCropTab image={image} imageKey={imageSrc ?? ""} />
            ) : (
              <SocialCropTab image={image} imageKey={imageSrc ?? ""} />
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
