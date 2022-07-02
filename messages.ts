// deno-lint-ignore-file no-explicit-any
import { bold, fmt, FormattedString, italic, link } from "./deps.ts";

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
  "issues": (payload: any) => {
    switch (payload.action) {
      case "opened": {
        const header = fmt`${
          bold(
            fmt`🐛 New issue ${
              link(
                fmt
                  `${payload.repository.name}#${payload.issue.number} ${payload.issue.title}`,
                payload.issue.html_url,
              )
            }\nby ${
              link(
                fmt`@${payload.issue.user.login}`,
                payload.issue.user.html_url,
              )
            }\n\n`,
          )
        }`;
        return fmt(
          ["", "", ""],
          header,
          payload.issue.body
            ? payload.issue.body.slice(0, 4096 - header.text.length)
            : italic("No description provided."),
        );
      }
    }
  },
};
