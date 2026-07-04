import type { Metadata } from "next";
import WordCounter from "@/tools/word-counter";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Word & Character Counter",
  description: "Count words, characters, sentences and estimate reading time.",
  path: "/word-counter",
});

export default function Page() {
  return <WordCounter />;
}
