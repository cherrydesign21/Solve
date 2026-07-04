export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingTimeMinutes: number;
}

export function analyzeText(text: string): TextStats {
  const trimmed = text.trim();
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const words = trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
  const sentences = trimmed.length === 0 ? 0 : (trimmed.match(/[^.!?]*[.!?]+/g) ?? [trimmed]).length;
  const paragraphs = trimmed.length === 0 ? 0 : text.split(/\n+/).filter((p) => p.trim().length > 0).length;
  const readingTimeMinutes = words / 200;

  return { characters, charactersNoSpaces, words, sentences, paragraphs, readingTimeMinutes };
}

export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return "< 1 min";
  const rounded = Math.round(minutes);
  return `${rounded} min${rounded === 1 ? "" : "s"}`;
}
