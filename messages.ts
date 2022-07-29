// deno-lint-ignore-file no-explicit-any
// Credits go to github.com/vrumger/gibhugbot.
import { fmt, FormattedString, italic, link } from "./deps.ts";

export const messages: Record<
  string,
  (payload: any) => FormattedString | undefined
> = {
  "push": (payload) => {
    if (payload.commits.length <= 0) {
      return;
    }
    return fmt`${fmt`${
      link(
        fmt`@${payload.sender.login}`,
        payload.sender.html_url,
      )
    } pushed ${
      link(
        fmt`${payload.commits.length} commit${
          payload.commits.length == 1 ? "" : "s"
        }`,
        payload.compare,
      )
    } to ${payload.repository.name}:${
      payload.ref.split("/")[2] ?? payload.ref
    }:`}\n\n${
      fmt(
        [""].concat(payload.commits.map(() => "")),
        ...payload.commits.map((v: any) =>
          fmt`${link(v.id.slice(0, 7), v.url)}: ${
            v.message.split("\n").map((v: string) => v)[0]
          }\n`
        ),
      )
    }`;
  },
  "issues": (payload) => {
    switch (payload.action) {
      case "opened": {
        const header = fmt`${fmt`${
          link(
            fmt`@${payload.issue.user.login}`,
            payload.issue.user.html_url,
          )
        } opened ${
          link(
            fmt`${payload.repository.name}#${payload.issue.number} ${payload.issue.title}`,
            payload.issue.html_url,
          )
        }`}${payload.issue.body ? ":" : "."}\n\n`;
        return fmt(
          ["", "", ""],
          header,
          payload.issue.body
            ? italic(payload.issue.body.slice(0, 4096 - header.text.length))
            : "",
        );
      }
    }
  },
  "pull_request": (payload) => {
    switch (payload.action) {
      case "opened": {
        const header = fmt`${
          link(
            fmt`@${payload.pull_request.user.login}`,
            payload.pull_request.user.html_url,
          )
        } opened ${
          link(
            fmt`${payload.repository.name}#${payload.pull_request.number} ${payload.pull_request.title}`,
            payload.pull_request.html_url,
          )
        }${payload.pull_request.body ? ":" : "."}\n\n`;
        return fmt(
          ["", "", ""],
          header,
          payload.pull_request.body
            ? italic(
              payload.pull_request.body.slice(0, 4096 - header.text.length),
            )
            : "",
        );
      }
      case "review_requested": {
        return fmt`${
          link(
            fmt`@${payload.sender.login}`,
            payload.sender.html_url,
          )
        } requested ${
          link(
            fmt`@${payload.requested_reviewer.login}`,
            payload.requested_reviewer.html_url,
          )
        } to review ${
          link(
            fmt`${payload.repository.name}#${payload.pull_request.number} ${payload.pull_request.title}`,
            payload.pull_request.html_url,
          )
        }.`;
      }
    }
  },
  "star": (payload) => {
    switch (payload.action) {
      case "created":
        return fmt`${
          link(fmt`@${payload.sender.login}`, payload.sender.html_url)
        } starred ${
          link(payload.repository.name, payload.repository.html_url)
        }.`;
    }
  },
  "fork": (payload) => {
    return fmt`${
      link(fmt`@${payload.sender.login}`, payload.sender.html_url)
    } forked ${link(payload.forkee.full_name, payload.forkee.html_url)} from ${
      link(payload.repository.full_name, payload.repository.html_url)
    }.`;
  },
  "pull_request_review": (payload) => {
    switch (payload.action) {
      case "submitted": {
        const verb = ({
          "commented": "reviewed",
          "approved": "approved",
          "changes_requested": "requested changes on",
        } as Record<string, string>)[payload.review.state];
        if (!verb) {
          return;
        }
        const header = fmt`${
          link(fmt`@${payload.sender.login}`, payload.sender.html_url)
        } ${verb} ${
          link(
            fmt`${payload.repository.name}#${payload.pull_request.number} ${payload.pull_request.title}`,
            payload.pull_request.html_url,
          )
        }\n\n`;
        return fmt(
          ["", "", ""],
          header,
          payload.review.body
            ? payload.review.body.slice(0, 4096 - header.text.length)
            : "",
        );
      }
    }
  },
  "issue_comment": (payload) => {
    switch (payload.action) {
      case "created": {
        const header = fmt`${
          link(
            fmt`@${payload.comment.user.login}`,
            payload.comment.user.html_url,
          )
        } ${
          link(
            fmt`commented on ${payload.repository.name}#${payload.issue.number} ${payload.issue.title} ${payload.comment.id}`,
            payload.comment.html_url,
          )
        }:\n\n`;
        return fmt(
          ["", "", ""],
          header,
          payload.comment.body.slice(0, 4096 - header.text.length),
        );
      }
    }
  },
};
