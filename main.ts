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
    return ctx.response.redirect("https://github.com/roj1512/ghb");
  }
  const payload = await ctx.request.body({ type: "json" }).value;
  const token = ctx.request.url.searchParams.get("token");
  const chatId = ctx.request.url.searchParams.get("chatId");
  if (token && chatId) {
    const bot = new Bot<ParseModeFlavor<Context>>(token);
    const text = messages[event]?.(payload);
    if (text != undefined) {
      await bot.api.sendMessage(chatId, text.toString(), {
        entities: text.entities,
        disable_web_page_preview: true,
      });
    }
  }
  ctx.response.status = 200;
});

app.listen({ port: 8000 });
