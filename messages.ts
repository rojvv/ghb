// deno-lint-ignore-file no-explicit-any
// Credits go to github.com/vrumger/gibhugbot.
import {
  fmt,
  FormattedString,
  italic,
  link,
  Stringable,
} from "grammy_parse_mode/mod.ts";
import { cleanMarkdown, updateHeader } from "./utils.ts";

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
    } ${payload.forced ? "forced" : "pushed"} ${
      link(
        fmt`${payload.commits.length} commit${
          payload.commits.length == 1 ? "" : "s"
        }`,
        payload.compare,
      )
    } to ${fmt`${link(payload.repository.name, payload.repository.html_url)}:${
      link(
        payload.ref.split("/")[2] ?? payload.ref,
        new URL(
          new URL(payload.repository.html_url).pathname +
            `/tree/${payload.ref}`,
          payload.repository.html_url,
        ).href,
      )
    }`}:`}\n\n${
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
      case "edited":
      case "closed":
      case "opened": {
        let header = fmt`${fmt`${
          link(
            fmt`@${payload.issue.user.login}`,
            payload.issue.user.html_url,
          )
        } ${payload.action} ${
          link(
            fmt`${payload.repository.name}#${payload.issue.number} ${payload.issue.title}`,
            payload.issue.html_url,
          )
        }`}.\n\n`;
        const body = payload.action == "opened" || payload.action == "edited"
          ? payload.issue.body
            ? italic(
              cleanMarkdown(payload.issue.body)
                .slice(0, 4096 - header.text.length),
            )
            : ""
          : "";
        if (body) {
          header = updateHeader(header);
        }
        return fmt(
          ["", "", ""],
          header,
          body,
        );
      }
    }
  },
  "pull_request": (payload) => {
    switch (payload.action) {
      case "opened": {
        let header = fmt`${
          link(
            fmt`@${payload.pull_request.user.login}`,
            payload.pull_request.user.html_url,
          )
        } opened ${
          link(
            fmt`${payload.repository.name}#${payload.pull_request.number} ${payload.pull_request.title}`,
            payload.pull_request.html_url,
          )
        }.\n\n`;
        const body = payload.pull_request.body
          ? italic(
            cleanMarkdown(payload.pull_request.body)
              .slice(0, 4096 - header.text.length),
          )
          : "";
        if (body) {
          header = updateHeader(header);
        }
        return fmt(
          ["", "", ""],
          header,
          body,
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
      case "deleted":
        return fmt`${
          link(fmt`@${payload.sender.login}`, payload.sender.html_url)
        } removed their star on ${
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
        if (
          payload.review.state == "commented" && payload.review.body == null
        ) {
          return;
        }
        const verb = ({
          "commented": link("reviewed", payload.review.html_url),
          "approved": link("approved", payload.review.html_url),
          "changes_requested": "requested changes on",
        } as Record<string, Stringable>)[payload.review.state];
        if (!verb) {
          return;
        }
        let header = fmt`${
          link(fmt`@${payload.sender.login}`, payload.sender.html_url)
        } ${verb} ${
          link(
            fmt`${payload.repository.name}#${payload.pull_request.number} ${payload.pull_request.title}`,
            payload.pull_request.html_url,
          )
        }.\n\n`;
        const body = payload.review.body
          ? italic(
            cleanMarkdown(payload.review.body)
              .slice(0, 4096 - header.text.length),
          )
          : "";
        if (body) {
          header = updateHeader(header);
        }
        return fmt(
          ["", "", ""],
          header,
          body,
        );
      }
    }
  },
  "pull_request_review_comment": (payload) => {
    switch (payload.action) {
      case "created": {
        const reviewUrl = new URL(
          `pull/${payload.pull_request.number}#pullrequestreview-${payload.comment.pull_request_review_id}`,
          (payload.repository.html_url + "/").replaceAll("//", "/"),
        ).href;
        let header = fmt`${
          link(
            fmt`@${payload.sender.login}`,
            payload.sender.html_url,
          )
        } ${link("commented", payload.comment.html_url)} on ${
          link(
            fmt`${payload.repository.name}#${payload.pull_request.number} (review)`,
            reviewUrl,
          )
        }.\n\n`;
        const body = payload.comment.body
          ? italic(
            cleanMarkdown(payload.comment.body)
              .slice(0, 4096 - header.text.length),
          )
          : "";
        if (body) {
          header = updateHeader(header);
        }
        return fmt(["", "", ""], header, body);
      }
    }
  },
  "issue_comment": (payload) => {
    switch (payload.action) {
      case "created":
      case "edited": {
        let header = fmt`${
          link(
            fmt`@${payload.sender.login}`,
            payload.sender.html_url,
          )
        } ${payload.action == "created" ? "created" : "edited"} ${
          link(
            fmt`${payload.repository.name}#${payload.issue.number} (comment)`,
            payload.comment.html_url,
          )
        }.\n\n`;
        const body = italic(
          cleanMarkdown(payload.comment.body)
            .slice(0, 4096 - header.text.length),
        );
        if (body) {
          header = updateHeader(header);
        }
        return fmt(
          ["", "", ""],
          header,
          body,
        );
      }
    }
  },
  "ping": (payload) => {
    const isRepository = payload.hook.type == "Repository";
    return fmt`Webhook activated for the ${
      isRepository ? "repository" : "organization"
    } ${
      isRepository
        ? link(payload.repository.full_name, payload.repository.html_url)
        : link(
          payload.organization.login,
          `https://github.com/${payload.organization.login}`,
        )
    }.`;
  },
  "delete": (payload) => {
    return fmt`${
      link(
        fmt`@${payload.sender.login}`,
        payload.sender.html_url,
      )
    } deleted the ${payload.ref_type} ${payload.ref} of ${
      link(payload.repository.full_name, payload.repository.html_url)
    }.`;
  },
};
