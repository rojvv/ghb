// deno-lint-ignore-file no-explicit-any
import { bold, fmt, FormattedString, link } from "./deps.ts";

export const messages: Record<
  string,
  (payload: any) => FormattedString | undefined
> = {
  "push": (payload: any) => {
    if (payload.commits.length < 0) {
      return;
    }
    return fmt`${
      bold(
        fmt`🔨 ${
          link(
            fmt`${payload.commits.length} new commit${
              payload.commits.length == 1 ? "" : "s"
            }`,
            payload.compare,
          )
        } to ${payload.repository.name}:${
          payload.ref.split("/")[2] ?? payload.ref
        }`,
      )
    }\n\n${
      payload.commits.map((v: any) =>
        fmt`${link(v.id.slice(0, 7), v.url)}: ${v.message} by ${v.author.name}`
      ).reduce(
        (
          p: any,
          c: any,
        ) => (new FormattedString(
          p.text + c.text,
          p.entities.concat(c.entities),
        )),
      )
    }`;
  },
};
