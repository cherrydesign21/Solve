"use client";

import { useCallback, useState } from "react";
import type { BlazeFaceModel, NormalizedFace } from "@tensorflow-models/blazeface";
import type { FaceBox } from "./logic";

let modelPromise: Promise<BlazeFaceModel> | null = null;

async function loadModel(): Promise<BlazeFaceModel> {
  if (!modelPromise) {
    modelPromise = (async () => {
      const tf = await import("@tensorflow/tfjs");
      try {
        await tf.setBackend("webgl");
        await tf.ready();
      } catch {
        // WebGL unavailable (older GPUs, some VMs/headless setups) — CPU backend
        // is slower but keeps face detection working instead of silently failing.
        await tf.setBackend("cpu");
        await tf.ready();
      }
      const blazeface = await import("@tensorflow-models/blazeface");
      return blazeface.load({ maxFaces: 5 });
    })();
  }
  return modelPromise;
}

function coord(value: [number, number] | { dataSync?: () => Float32Array | Int32Array | Uint8Array }): [number, number] {
  if (Array.isArray(value)) return value;
  const data = value.dataSync?.();
  return data ? [data[0], data[1]] : [0, 0];
}

function largestFace(predictions: NormalizedFace[]): FaceBox | null {
  let best: FaceBox | null = null;
  let bestArea = 0;
  for (const prediction of predictions) {
    const [x1, y1] = coord(prediction.topLeft);
    const [x2, y2] = coord(prediction.bottomRight);
    const width = x2 - x1;
    const height = y2 - y1;
    const area = width * height;
    if (area > bestArea) {
      bestArea = area;
      best = { x: x1, y: y1, width, height };
    }
  }
  return best;
}

interface UseFaceDetectionResult {
  detect: (image: HTMLImageElement) => Promise<FaceBox | null>;
  loading: boolean;
  error: string | null;
}

export function useFaceDetection(): UseFaceDetectionResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detect = useCallback(async (image: HTMLImageElement): Promise<FaceBox | null> => {
    setLoading(true);
    setError(null);
    try {
      const model = await loadModel();
      const predictions = await model.estimateFaces(image, false);
      return largestFace(predictions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Face detection failed — falling back to a centered crop.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { detect, loading, error };
}
