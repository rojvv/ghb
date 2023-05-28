import { DOMParser } from "deno_dom";
import { marked } from "marked";
import { FormattedString } from "grammy_parse_mode/mod.ts";

export function cleanMarkdown(markdown: string) {
  const dom = new DOMParser().parseFromString(
    marked.parse(markdown),
    "text/html",
  );
  return (dom?.textContent ?? markdown).trim();
}

export function updateHeader(header: FormattedString) {
  return new FormattedString(
    header.text.slice(0, -3) + ":" + header.text.slice(-2),
    header.entities,
  );
}
