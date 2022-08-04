# Public GitHub Notification Webhook

## Installation

- Create a bot by contacting [@BotFather](https://t.me/BotFather).
- Create a new channel or group.
- Add the bot you created.
- Open the settings of a repository.
- Go to the Webhooks tab.
- Click Add webhook.
- Set the Payload URL to

```text
https://ghb.deno.dev/?token=<your_bot's_token>&chat_id<your_chat's_id>
```

- Set the Content type to `application/json`.
- Choose Send me everything.
- Click Add webhook.
