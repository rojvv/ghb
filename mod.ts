import { Application } from "https://deno.land/x/oak@v10.5.1/mod.ts";

const app = new Application();

app.use(async (ctx) => {
  console.log(await ctx.request.body({ type: "json" }).value);
});

app.listen({ port: 8000 });
