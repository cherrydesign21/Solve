"use client";

import { useCallback, useMemo, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Download, RotateCcw } from "lucide-react";
import clsx from "clsx";
import { Slider } from "@/components/ui/Slider";
import { ASPECT_OPTIONS, downloadBlob, exportCroppedImage } from "./logic";

interface CustomCropTabProps {
  image: HTMLImageElement;
  imageKey: string;
}

export function CustomCropTab({ image, imageKey }: CustomCropTabProps) {
  const aspectOptions = useMemo(
    () => [{ id: "original", label: "Original", value: image.naturalWidth / image.naturalHeight }, ...ASPECT_OPTIONS],
    [image]
  );

  const [aspectId, setAspectId] = useState("original");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [exporting, setExporting] = useState(false);

  const aspect = aspectOptions.find((a) => a.id === aspectId)?.value ?? aspectOptions[0].value;

  const handleCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleDownload = async () => {
    if (!croppedAreaPixels) return;
    setExporting(true);
    try {
      const blob = await exportCroppedImage(image, croppedAreaPixels, rotation);
      downloadBlob(blob, "cropped-image.png");
    } finally {
      setExporting(false);
    }
  };

  const resetView = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        {aspectOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setAspectId(option.id)}
            className={clsx(
              "rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wide transition-colors duration-200 sm:text-sm",
              option.id === aspectId ? "bg-accent text-black" : "bg-white/10 text-white/60 hover:text-white"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="relative h-[380px] w-full overflow-hidden rounded-xl border border-white/10 bg-black sm:h-[460px]">
        <Cropper
          key={`${imageKey}-${aspectId}`}
          image={image.src}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropComplete={handleCropComplete}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-white">Zoom</p>
          <Slider value={zoom} min={1} max={4} step={0.01} onChange={setZoom} ariaLabel="Zoom" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-white">Rotate</p>
          <Slider value={rotation} min={-180} max={180} step={1} onChange={setRotation} ariaLabel="Rotate" />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          onClick={resetView}
          className="flex items-center gap-2 rounded-md border border-white/10 px-4 py-2.5 text-sm font-medium text-white/60 transition-colors hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
        <button
          type="button"
          onClick={handleDownload}
          disabled={!croppedAreaPixels || exporting}
          className="flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Download className="h-4 w-4" />
          {exporting ? "Exporting…" : "Download Cropped Image"}
        </button>
      </div>
    </div>
  );
}
