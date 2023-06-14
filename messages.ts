// deno-lint-ignore-file no-explicit-any
// Credits go to github.com/vrumger/gibhugbot.
import {
  fmt,
  FormattedString,
  italic,
  link,
  Stringable,
} from "grammy_parse_mode/mod.ts";
import { cleanMarkdown, getSenderText, updateHeader } from "./utils.ts";

export const messages: Record<
  string,
  (payload: any) => FormattedString | undefined
> = {
  "push": (payload) => {
    if (payload.commits.length <= 0) {
      return;
    }
    return fmt`${fmt`${getSenderText(payload.sender)} ${
      payload.forced ? "forced" : "pushed"
    } ${
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
    const sender = link(
      fmt`@${payload.sender.login}`,
      payload.sender.html_url,
    );
    const issue = link(
      fmt`${payload.repository.name}#${payload.issue.number} ${payload.issue.title}`,
      payload.issue.html_url,
    );
    switch (payload.action) {
      case "edited":
      case "closed":
      case "reopened":
      case "opened": {
        let header = fmt`${sender} ${payload.action} ${issue}.\n\n`;
        const body = payload.action == "opened" || payload.action == "edited"
          ? payload.issue.body
            ? italic(
              cleanMarkdown(payload.issue.body)
                .slice(0, 4096 - header.text.length),
            )
            : ""
          : "";
        if (cleanMarkdown(String(body))) {
          header = updateHeader(header);
        }
        return fmt(
          ["", "", ""],
          header,
          body,
        );
      }
      case "labeled":
        return fmt`${sender} added the label ${
          italic(payload.label.name)
        } to ${issue}.`;
      case "unlabeled":
        return fmt`${sender} removed the label ${
          italic(payload.label.name)
        } from ${issue}.`;
    }
  },
  "pull_request": (payload) => {
    const sender = getSenderText(payload.sender);
    const pullRequest = link(
      fmt`${payload.repository.name}#${payload.pull_request.number} ${payload.pull_request.title}`,
      payload.pull_request.html_url,
    );
    switch (payload.action) {
      case "edited":
      case "closed":
      case "reopened":
      case "opened": {
        let header = fmt`${sender} ${payload.action} ${pullRequest}.\n\n`;
        const body = payload.action == "opened" || payload.action == "edited"
          ? payload.pull_request.body
            ? italic(
              cleanMarkdown(payload.pull_request.body)
                .slice(0, 4096 - header.text.length),
            )
            : ""
          : "";
        if (cleanMarkdown(String(body))) {
          header = updateHeader(header);
        }
        return fmt(
          ["", "", ""],
          header,
          body,
        );
      }
      case "review_requested": {
        return fmt`${sender} requested ${
          link(
            fmt`@${payload.requested_reviewer.login}`,
            payload.requested_reviewer.html_url,
          )
        } to review ${pullRequest}.`;
      }
      case "labeled":
        return fmt`${sender} added the label ${
          italic(payload.label.name)
        } to ${pullRequest}.`;
      case "unlabeled":
        return fmt`${sender} removed the label ${
          italic(payload.label.name)
        } from ${pullRequest}.`;
    }
  },
  "star": (payload) => {
    switch (payload.action) {
      case "created":
        return fmt`${getSenderText(payload.sender)} starred ${
          link(payload.repository.name, payload.repository.html_url)
        }.`;
      case "deleted":
        return fmt`${getSenderText(payload.sender)} unstarred ${
          link(payload.repository.name, payload.repository.html_url)
        }.`;
    }
  },
  "fork": (payload) => {
    return fmt`${getSenderText(payload.sender)} forked ${
      link(payload.forkee.full_name, payload.forkee.html_url)
    } from ${link(payload.repository.name, payload.repository.html_url)}.`;
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
        let header = fmt`${getSenderText(payload.sender)} ${verb} ${
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
        if (cleanMarkdown(String(body))) {
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
        let header = fmt`${getSenderText(payload.sender)} ${
          link("commented", payload.comment.html_url)
        } on ${
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
        if (cleanMarkdown(String(body))) {
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
        let header = fmt`${getSenderText(payload.sender)} ${
          payload.action == "created" ? "created" : "edited"
        } ${
          link(
            fmt`${payload.repository.name}#${payload.issue.number} (comment)`,
            payload.comment.html_url,
          )
        }.\n\n`;
        const body = italic(
          cleanMarkdown(payload.comment.body)
            .slice(0, 4096 - header.text.length),
        );
        if (cleanMarkdown(String(body))) {
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
        ? link(payload.repository.name, payload.repository.html_url)
        : link(
          payload.organization.login,
          `https://github.com/${payload.organization.login}`,
        )
    }.`;
  },
  "delete": (payload) => {
    return fmt`${
      getSenderText(payload.sender)
    } deleted the ${payload.ref_type} ${payload.ref} of ${
      link(payload.repository.name, payload.repository.html_url)
    }.`;
  },
  "release": (payload) => {
    switch (payload.action) {
      case "created":
        return fmt`${
          link(
            `${payload.repository.name} ${payload.release.name}`,
            payload.release.html_url,
          )
        } was released.`;
    }
  },
};
