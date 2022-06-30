// deno-lint-ignore-file no-explicit-any
import { Application, Bot, ParseModeContext } from "./deps.ts";
import { messages } from "./messages.ts";

const app = new Application();

app.use(async (ctx) => {
  const event = ctx.request.headers.get("x-github-event");
  if (!event) {
    return;
  }
  const payload = await ctx.request.body({ type: "json" }).value;
  const token = ctx.request.url.searchParams.get("token");
  const chatId = ctx.request.url.searchParams.get("chatId");
  if (token && chatId) {
    const bot = new Bot<ParseModeContext>(token);
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
