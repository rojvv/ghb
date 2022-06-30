// deno-lint-ignore-file no-explicit-any
import {
  Application,
  bold,
  Bot,
  fmt,
  FormattedString,
  link,
  ParseModeContext,
} from "./deps.ts";

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
          fmt`🔨 ${
            link(
              fmt`${payload.commits.length} new commit${
                payload.commits.length == 1 ? "" : "s"
              }`,
              payload.compare,
            )
          } to ${payload.repository.name}:${
            payload.ref.split("/")[2] ?? payload.ref
          }`,
        )
      }\n\n${
        fmt(
          ["", ...payload.commits.map(() => "")],
          payload.commits.map((v: any) =>
            fmt`${
              link(v.id.slice(0, 7), v.url)
            }: ${v.message} by ${v.author.name}`
          ),
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
