import { Application } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { Bot } from "https://deno.land/x/grammy@v1.9.0/mod.ts";

const app = new Application();

app.use(async (ctx) => {
  const payload = await ctx.request.body({ type: "json" }).value;
  const token = ctx.request.url.searchParams.get("token");
  const chatId = ctx.request.url.searchParams.get("chatId");
  if (token && chatId) {
    const bot = new Bot(token);
    let text = "";
    if (payload?.commits?.length != 0) {
      text += payload.commits.map((v: any) =>
        `${v.author} ${v.message} ${v.id}`
      );
    }
    if (text != "") {
      bot.api.sendMessage(chatId, text);
    }
  }
});

app.listen({ port: 8000 });
