import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.36-alpha/deno-dom-wasm.ts";
import { marked } from "https://deno.land/x/marked@1.0.1/mod.ts";

export function cleanMarkdown(markdown: string) {
  const dom = new DOMParser().parseFromString(
    marked.parse(markdown),
    "text/html",
  );
  return (dom?.textContent ?? markdown).trim();
}
