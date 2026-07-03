"use client";

import { useEffect, useState } from "react";
import { Download, FolderArchive, Loader2, Sparkles } from "lucide-react";
import {
  computeSubjectCropRect,
  downloadBlob,
  exportCroppedImage,
  scaledDimensions,
  slugify,
  type FaceBox,
  type PixelCrop,
} from "./logic";
import { groupPresetsByPlatform, socialPresets, type SocialPreset } from "./presets";
import { useFaceDetection } from "./useFaceDetection";

interface SocialCropTabProps {
  image: HTMLImageElement;
}

interface PresetResult {
  preset: SocialPreset;
  crop: PixelCrop;
  previewUrl: string;
}

function assetFilename(preset: SocialPreset): string {
  return `${slugify(preset.platform)}-${slugify(preset.label)}.png`;
}

export function SocialCropTab({ image }: SocialCropTabProps) {
  const { detect, error: detectError } = useFaceDetection();
  const [faceStatus, setFaceStatus] = useState<"detecting" | "done">("detecting");
  const [face, setFace] = useState<FaceBox | null>(null);
  const [results, setResults] = useState<PresetResult[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [generatingZip, setGeneratingZip] = useState(false);

  useEffect(() => {
    let cancelled = false;
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

  useEffect(() => {
    if (faceStatus !== "done") return;
    let cancelled = false;
    (async () => {
      const generated: PresetResult[] = [];
      for (const preset of socialPresets) {
        const crop = computeSubjectCropRect(
          image.naturalWidth,
          image.naturalHeight,
          face,
          preset.width / preset.height
        );
        const previewSize = scaledDimensions(preset.width, preset.height, 320);
        const blob = await exportCroppedImage(image, crop, 0, previewSize.width, previewSize.height, "image/jpeg");
        if (cancelled) return;
        generated.push({ preset, crop, previewUrl: URL.createObjectURL(blob) });
      }
      if (!cancelled) setResults(generated);
    })();
    return () => {
      cancelled = true;
    };
  }, [faceStatus, face, image]);

  // Revoke preview object URLs whenever a new batch replaces them, and on unmount.
  useEffect(() => {
    return () => {
      results.forEach((r) => URL.revokeObjectURL(r.previewUrl));
    };
  }, [results]);

  const handleDownloadSingle = async (result: PresetResult) => {
    setDownloadingId(result.preset.id);
    try {
      const blob = await exportCroppedImage(image, result.crop, 0, result.preset.width, result.preset.height);
      downloadBlob(blob, assetFilename(result.preset));
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadAll = async () => {
    setGeneratingZip(true);
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      for (const result of results) {
        const blob = await exportCroppedImage(image, result.crop, 0, result.preset.width, result.preset.height);
        zip.file(assetFilename(result.preset), blob);
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(zipBlob, "solve-social-media-assets.zip");
    } finally {
      setGeneratingZip(false);
    }
  };

  if (faceStatus !== "done" || results.length === 0) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.02]">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
        <p className="text-sm text-white/50">
          {faceStatus !== "done" ? "Detecting the subject…" : "Generating previews…"}
        </p>
      </div>
    );
  }

  const groups = groupPresetsByPlatform(results.map((r) => r.preset));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:px-5">
        <p className="flex items-center gap-2 text-sm text-white/60">
          {face ? (
            <>
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-white">Subject auto-centered</span> across all {results.length} sizes
            </>
          ) : (
            <span>No face detected — using a centered crop for all {results.length} sizes</span>
          )}
        </p>
        <button
          type="button"
          onClick={handleDownloadAll}
          disabled={generatingZip}
          className="flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold uppercase tracking-wide text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          {generatingZip ? <Loader2 className="h-4 w-4 animate-spin" /> : <FolderArchive className="h-4 w-4" />}
          {generatingZip ? "Zipping…" : "Download All (ZIP)"}
        </button>
      </div>

      {detectError && <p className="text-xs text-white/30">{detectError}</p>}

      <div className="flex flex-col gap-6">
        {Object.entries(groups).map(([platform, presets]) => (
          <div key={platform} className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">{platform}</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {presets.map((preset) => {
                const result = results.find((r) => r.preset.id === preset.id);
                if (!result) return null;
                return (
                  <div key={preset.id} className="flex flex-col gap-2">
                    <div className="group relative overflow-hidden rounded-lg border border-white/10 bg-black">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={result.previewUrl} alt={`${preset.platform} ${preset.label} preview`} className="block w-full" />
                      <button
                        type="button"
                        onClick={() => handleDownloadSingle(result)}
                        disabled={downloadingId === preset.id}
                        aria-label={`Download ${preset.platform} ${preset.label}`}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 disabled:opacity-100"
                      >
                        {downloadingId === preset.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">{preset.label}</p>
                      <p className="text-[11px] text-white/35">
                        {preset.width} × {preset.height}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
