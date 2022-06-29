import { Application } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { Bot } from "https://deno.land/x/grammy@v1.9.0/mod.ts";
import { html } from "https://deno.land/x/esc@0.0.0/mod.ts";

const app = new Application();

app.use(async (ctx) => {
  const payload = await ctx.request.body({ type: "json" }).value;
  const token = ctx.request.url.searchParams.get("token");
  const chatId = ctx.request.url.searchParams.get("chatId");
  if (token && chatId) {
    const bot = new Bot(token);
    let text = "";
    if (payload?.commits?.length != 0) {
      text += `<b>🔨 ${payload.commits.length} new commit${
        payload.commits.length == 1 ? "" : "s"
      } to ${payload.repository.name}:${payload.ref.slice(5)}</b>\n\n`;
      text += payload.commits.map((v: any) =>
        `<a href="${v.compare}">${v.id.slice(0, 6)}</a>: ${v.message} by ${
          html(v.author.name)
        }`
      );
    }
    if (text != "") {
      bot.api.sendMessage(chatId, text, { parse_mode: "HTML" });
    }
  }
  ctx.response.status = 200;
});

app.listen({ port: 8000 });
