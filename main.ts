import { Application } from "oak/mod.ts";
import { Bot, Context } from "grammy/mod.ts";
import { ParseModeFlavor } from "grammy_parse_mode/mod.ts";
import { messages } from "./messages.ts";

const app = new Application();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.response.status = 500;
    console.error(err);
  }
});

app.use(async (ctx) => {
  const event = ctx.request.headers.get("x-github-event");
  if (!event) {
    return ctx.response.redirect("https://github.com/rojvv/ghb");
  }
  const payload = await ctx.request.body.json();
  const token = ctx.request.url.searchParams.get("token");
  const chatId = ctx.request.url.searchParams.get("chatId");
  if (token && chatId) {
    const bot = new Bot<ParseModeFlavor<Context>>(token);
    const formattedString = messages[event]?.(payload);
    const text = formattedString?.toString();
    const entities = formattedString?.entities;
    if (text != undefined) {
      await bot.api.sendMessage(
        chatId,
        text.toString().substring(0, 4093) + (text.length > 4093 ? "..." : ""),
        {
          entities: entities?.filter((v) => !((v.offset + v.length) > 4093)),
          link_preview_options: { is_disabled: true },
        },
      );
    }
  }
  ctx.response.status = 200;
});

app.listen({ port: 8000 });
