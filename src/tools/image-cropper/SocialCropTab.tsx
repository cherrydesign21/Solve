"use client";

import { useEffect, useMemo, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Download, Loader2, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/Slider";
import { PresetPicker } from "./PresetPicker";
import { socialPresets, type SocialPreset } from "./presets";
import { computeSubjectCropRect, downloadBlob, exportCroppedImage, type FaceBox, type PixelCrop } from "./logic";
import { useFaceDetection } from "./useFaceDetection";

interface SocialCropTabProps {
  image: HTMLImageElement;
  imageKey: string;
}

export function SocialCropTab({ image, imageKey }: SocialCropTabProps) {
  const { detect, error: detectError } = useFaceDetection();
  const [faceStatus, setFaceStatus] = useState<"detecting" | "done">("detecting");
  const [face, setFace] = useState<FaceBox | null>(null);
  const [preset, setPreset] = useState<SocialPreset | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Reset detection state for the new image, then kick off async face detection.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFaceStatus("detecting");
    setFace(null);
    detect(image).then((result) => {
      if (cancelled) return;
      setFace(result);
      setFaceStatus("done");
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  const subjectRect: PixelCrop | null = useMemo(() => {
    if (!preset || faceStatus !== "done") return null;
    return computeSubjectCropRect(image.naturalWidth, image.naturalHeight, face, preset.width / preset.height);
  }, [preset, faceStatus, face, image]);

  const handleSelectPreset = (next: SocialPreset) => {
    setPreset(next);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const handleDownload = async () => {
    if (!preset || !croppedAreaPixels) return;
    setExporting(true);
    try {
      const blob = await exportCroppedImage(image, croppedAreaPixels, 0, preset.width, preset.height);
      const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      downloadBlob(blob, `${slug(preset.platform)}-${slug(preset.label)}.png`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      <div className="lg:w-[280px] lg:shrink-0 lg:overflow-y-auto">
        <PresetPicker presets={socialPresets} selectedId={preset?.id ?? null} onSelect={handleSelectPreset} />
      </div>

      <div className="min-w-0 flex-1">
        {!preset && (
          <div className="flex h-[380px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/15 px-6 text-center sm:h-[460px]">
            <Sparkles className="h-8 w-8 text-white/25" />
            <p className="max-w-xs text-sm text-white/40">
              Pick a platform on the left to generate a perfectly sized, subject-centered crop.
            </p>
          </div>
        )}

        {preset && faceStatus !== "done" && (
          <div className="flex h-[380px] flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] sm:h-[460px]">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
            <p className="text-sm text-white/50">Detecting the subject…</p>
          </div>
        )}

        {preset && faceStatus === "done" && subjectRect && (
          <>
            <div className="relative h-[380px] w-full overflow-hidden rounded-xl border border-white/10 bg-black sm:h-[460px]">
              <Cropper
                key={`${imageKey}-${preset.id}`}
                image={image.src}
                crop={crop}
                zoom={zoom}
                rotation={0}
                aspect={preset.width / preset.height}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_area, areaPixels) => setCroppedAreaPixels(areaPixels)}
                initialCroppedAreaPixels={subjectRect}
              />
            </div>

            <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-2 sm:w-56">
                <p className="text-sm font-medium text-white">Zoom</p>
                <Slider value={zoom} min={1} max={4} step={0.01} onChange={setZoom} ariaLabel="Zoom" />
              </div>

              <p className="text-xs text-white/40 sm:text-sm">
                Exports at exactly <span className="font-medium text-white">{preset.width} × {preset.height}px</span>
                <br />
                {face ? (
                  <span className="mt-1 inline-flex items-center gap-1 text-accent">
                    <Sparkles className="h-3.5 w-3.5" /> Subject auto-centered
                  </span>
                ) : (
                  <span className="mt-1 inline-block text-white/30">No face detected — centered crop used</span>
                )}
              </p>

              <button
                type="button"
                onClick={handleDownload}
                disabled={!croppedAreaPixels || exporting}
                className="flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Download className="h-4 w-4" />
                {exporting ? "Exporting…" : "Download"}
              </button>
            </div>
          </>
        )}

        {detectError && <p className="mt-3 text-xs text-white/30">{detectError}</p>}
      </div>
    </div>
  );
}
