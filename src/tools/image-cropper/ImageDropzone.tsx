"use client";

import { useRef, useState, type DragEvent } from "react";
import { ImagePlus, ShieldCheck } from "lucide-react";

interface ImageDropzoneProps {
  onFile: (file: File) => void;
}

export function ImageDropzone({ onFile }: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file && file.type.startsWith("image/")) onFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-colors duration-200 sm:py-24 ${
        dragOver ? "border-accent bg-accent/5" : "border-white/15 bg-white/[0.02] hover:border-white/30"
      }`}
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent">
        <ImagePlus className="h-7 w-7" />
      </span>
      <div>
        <p className="text-base font-medium text-white sm:text-lg">
          Drag &amp; drop an image, or click to browse
        </p>
        <p className="mt-1 text-sm text-white/40">PNG, JPG or WebP</p>
      </div>
      <p className="flex items-center gap-1.5 text-xs text-white/30">
        <ShieldCheck className="h-3.5 w-3.5" />
        Processed entirely in your browser — nothing is uploaded anywhere.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
