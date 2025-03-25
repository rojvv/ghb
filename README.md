# Public GitHub-Telegram Notification Webhook

- [Installation](#installation)
  - [Setting Up a Chat](#setting-up-a-chat)
  - [Obtaining the Webhook URL](#obtaining-the-webhook-url)
  - [Configuring GitHub](#configuring-github)
    - [A Single Repository](#a-single-repository)
    - [A Whole Organization](#a-whole-organization)
- [Username Directory](#username-directory)
- [Supported Events](#supported-events)

## Installation

### Setting Up a Chat

1. Create a bot by contacting [@BotFather](https://t.me/BotFather).
2. Create a new channel or group.
3. If you just created a group, for a better experience, convert it to a
   supergroup by going to Settings > Chat history for new members, and set it to
   visible. You can later undo this.
4. Get its ID.

### Obtaining the Webhook URL

After you have a bot and a chat ready, your webhook URL will look like this:

```text
https://ghb.deno.dev/?token=your_bot_token&chatId=your_chat_id
```

If the chat is a forum, you can specify a topic ID using `messageThreadId`:

```text
https://ghb.deno.dev/?token=your_bot_token&chatId=your_chat_id&messageThreadId=topicId
```

If you use a self-hosted version, you might need to replace
`https://ghb.deno.dev/` with something else.

### Configuring GitHub

#### A Single Repository

1. Open the settings of your repository.
2. Go to the Webhooks tab.
3. Click Add webhook.
4. Set the Payload URL to the URL you obtained previously.
5. Set the Content type to `application/json`.
6. Choose Send me everything.
7. Click Add webhook.

#### A Whole Organization

If your repositories are under a GitHub organization, we recommend configuring
the whole organization once, so you won't have to configure each repository
individually. The steps are the same as configuring the webhook for a single
repository, except you open your organization's settings instead.

1. Open the settings of your organization.
2. Go to the Webhooks tab.
3. Click Add webhook.
4. Set the Payload URL to the URL you obtained previously.
5. Set the Content type to `application/json`.
6. Choose Send me everything.
7. Click Add webhook.

## Username Directory

If anyone prefers to display their Telegram handle next to their GitHub handle
in the notifications relevant to them, they can make a pull request to add
themselves to the [`username_directory.json`](./username_directory.json) file.

This will apply for all users of the public instance.

## Supported Events

Notifications are currently sent when:

- the webhook is activated
- a push is made
- an issue is opened, edited, closed, or reopened
- a pull request is opened, edited, closed, or reopened
- Someone adds or removes a star
- a fork is made
- a pull request review is submitted
- a comment is made on a pull request review
- a comment is made on a pull request or an issue
- a branch or ref is deleted
- a release is made
- a deployment is made
