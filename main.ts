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
      text +=
        `<b>🔨 <a href="${payload.compare}">${payload.commits.length} new commit${
          payload.commits.length == 1 ? "" : "s"
        }</a> to ${payload.repository.name}:${
          payload.ref.split("/")[2] ?? payload.ref
        }</b>\n\n`;
      text += payload.commits.map((v: any) =>
        `<a href="${v.url}">${v.id.slice(0, 7)}</a>: ${v.message} by ${
          html(v.author.name)
        }`
      );
    }
    if (text != "") {
      await bot.api.sendMessage(chatId, text, {
        parse_mode: "HTML",
        disable_web_page_preview: true,
      });
    }
  }
  ctx.response.status = 200;
});

app.listen({ port: 8000 });
