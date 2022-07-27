// deno-lint-ignore-file no-explicit-any
// Credits go to github.com/vrumger/gibhugbot.
import { bold, fmt, FormattedString, italic, link } from "./deps.ts";

export const messages: Record<
  string,
  (payload: any) => FormattedString | undefined
> = {
  "push": (payload: any) => {
    if (payload.commits.length <= 0) {
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
      fmt(
        [""].concat(payload.commits.map(() => "")),
        ...payload.commits.map((v: any) =>
          fmt`${link(v.id.slice(0, 7), v.url)}: ${
            v.message.split("\n").map((v: string) => v)[0]
          } by ${v.author.name}\n`
        ),
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
                fmt`${payload.repository.name}#${payload.issue.number} ${payload.issue.title}`,
                payload.issue.html_url,
              )
            }`,
          )
        }\nby ${
          link(
            fmt`@${payload.issue.user.login}`,
            payload.issue.user.html_url,
          )
        }\n\n`;
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
  "pull_request": (payload: any) => {
    switch (payload.action) {
      case "opened": {
        const header = fmt`${
          bold(
            fmt`🔌 New pull request ${
              link(
                fmt`${payload.repository.name}#${payload.pull_request.number} ${payload.pull_request.title}`,
                payload.pull_request.html_url,
              )
            }`,
          )
        }\nby ${
          link(
            fmt`@${payload.pull_request.user.login}`,
            payload.pull_request.user.html_url,
          )
        }\n\n`;
        return fmt(
          ["", "", ""],
          header,
          payload.pull_request.body
            ? payload.pull_request.body.slice(0, 4096 - header.text.length)
            : italic("No description provided."),
        );
      }
    }
  },
  "star": (payload: any) => {
    switch (payload.action) {
      case "created":
        return fmt`${
          bold(
            fmt`⭐️ New star ${
              link(payload.repository.name, payload.repository.html_url)
            }`,
          )
        }\nby ${link(fmt`@${payload.sender.login}`, payload.sender.html_url)}`;
    }
  },
};
