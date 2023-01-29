import { DOMParser } from "deno_dom";
import { marked } from "marked";

export function cleanMarkdown(markdown: string) {
  const dom = new DOMParser().parseFromString(
    marked.parse(markdown),
    "text/html",
  );
  return (dom?.textContent ?? markdown).trim();
}
