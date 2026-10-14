import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { ORPCError, onError } from "@orpc/server";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import type { Auth } from "../users/auth.ts";
import { createRequireSession, type SessionVariables } from "./require-session.ts";
import { type ApiContext, router } from "./router.ts";

const handler = new OpenAPIHandler(router, {
  interceptors: [
    onError((error) => {
      if (error instanceof ORPCError && error.status < 500) return;

      const detail = error instanceof Error ? error.message : String(error);
      console.error(JSON.stringify({ message: "oRPC request failed", detail }));
    }),
  ],
});

export const createApp = ({
  auth,
  createContext,
}: {
  auth: Auth;
  createContext: () => Omit<ApiContext, "user">;
}) => {
  const app = new Hono<{ Variables: SessionVariables }>();
  const requireSession = createRequireSession({ auth });

  const handleRpc = createMiddleware<{ Variables: SessionVariables }>(async (context, next) => {
    const apiContext = { ...createContext(), user: context.get("user") };
    const { matched, response } = await handler.handle(context.req.raw, { context: apiContext });

    if (matched) return context.newResponse(response.body, response);

    await next();
  });

  app.get("/health", (context) => context.json({ status: "ok" }));

  app.on(["GET", "POST"], "/auth/*", (context) => {
    context.header("Cache-Control", "no-store");

    return auth.handler(context.req.raw);
  });

  app.use("/notes/*", requireSession, handleRpc);
  app.use("/account/*", requireSession, handleRpc);

  app.notFound((context) => context.json({ code: "NOT_FOUND", message: "Not found" }, 404));

  app.onError((error, context) => {
    console.error(
      JSON.stringify({
        message: "Unhandled request error",
        detail: error.message,
        path: context.req.path,
      }),
    );

    return context.json({ code: "INTERNAL_SERVER_ERROR", message: "Internal server error" }, 500);
  });

  return app;
};
