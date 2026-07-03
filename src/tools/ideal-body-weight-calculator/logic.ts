import type { Gender } from "@/lib/health";

export interface IdealWeightResult {
  devine: number;
  robinson: number;
  miller: number;
  hamwi: number;
  average: number;
  min: number;
  max: number;
}

export function calculateIdealWeight(gender: Gender, heightCm: number): IdealWeightResult {
  const heightIn = heightCm / 2.54;
  const over = Math.max(0, heightIn - 60);

  const devine = gender === "male" ? 50 + 2.3 * over : 45.5 + 2.3 * over;
  const robinson = gender === "male" ? 52 + 1.9 * over : 49 + 1.7 * over;
  const miller = gender === "male" ? 56.2 + 1.41 * over : 53.1 + 1.36 * over;
  const hamwi = gender === "male" ? 48 + 2.7 * over : 45.5 + 2.2 * over;

  const values = [devine, robinson, miller, hamwi];
  const average = values.reduce((sum, v) => sum + v, 0) / values.length;

  return {
    devine,
    robinson,
    miller,
    hamwi,
    average,
    min: Math.min(...values),
    max: Math.max(...values),
  };
}
