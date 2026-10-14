import { createMiddleware } from "hono/factory";
import type { Auth } from "../auth/auth.ts";

export type SessionUser = { id: string; email: string };
export type SessionVariables = { user: SessionUser };

export const createRequireSession = ({ auth }: { auth: Auth }) => {
  const requireSession = createMiddleware<{ Variables: SessionVariables }>(
    async (context, next) => {
      context.header("Cache-Control", "no-store");
      const session = await auth.api.getSession({ headers: context.req.raw.headers });
      if (!session)
        return context.json({ code: "UNAUTHORIZED", message: "Sign in to continue" }, 401);

      const { user } = session;
      const { id, email } = user;
      context.set("user", { id, email });
      await next();
    },
  );

  return requireSession;
};
