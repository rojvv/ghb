import { DOMParser } from "deno_dom";
import { marked } from "marked";
import { fmt, FormattedString, link } from "grammy_parse_mode/mod.ts";
import usernameDirectory from "./username_directory.json" assert {
  type: "json",
};

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

// deno-lint-ignore no-explicit-any
export function getSenderText(sender: any) {
  const username =
    (usernameDirectory as Record<string, string | undefined>)[sender.login];
  return fmt`${link(`@${sender.login}`, sender.html_url)}${
    username ? fmt` (${link(`@${username}`, `https://t.me/${username}`)})` : ""
  }`;
}
