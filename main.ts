// deno-lint-ignore-file no-explicit-any
import { Application } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { Bot } from "https://deno.land/x/grammy@v1.9.0/mod.ts";
import { html } from "https://deno.land/x/esc@0.0.0/mod.ts";
import {
  bold,
  fmt,
  FormattedString,
  link,
  ParseModeContext,
} from "https://deno.land/x/grammy_parse_mode@1.1.2/mod.ts";

const app = new Application();

app.use(async (ctx) => {
  const payload = await ctx.request.body({ type: "json" }).value;
  const token = ctx.request.url.searchParams.get("token");
  const chatId = ctx.request.url.searchParams.get("chatId");
  if (token && chatId) {
    const bot = new Bot<ParseModeContext>(token);
    let text: FormattedString | undefined;
    if (payload?.commits?.length != 0) {
      text = fmt`${
        bold(
          fmt`🔨 ${link(payload.compare, payload.compare.length)} new commit${
            payload.commits.length == 1 ? "" : "s"
          } to ${payload.repository.name}:${
            payload.ref.split("/")[2] ?? payload.ref
          }`,
        )
      }\n\n${
        payload.commits.map((v: any) =>
          fmt`${
            link(v.url, v.id.slice(0, 7))
          }: ${v.message} by ${v.author.name}`
        )
      }`;
    }
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
