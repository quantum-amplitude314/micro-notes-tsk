import { createPool } from "mysql2/promise";
import { createOrm } from "./db/orm.ts";
import type { Env } from "./env.ts";
import { createApp } from "./http/app.ts";
import { MikroOrmNoteRepository } from "./notes/mikro-orm-note-repository.ts";
import { createAuth } from "./users/auth.ts";
import { BetterAuthUserRepository } from "./users/better-auth-user-repository.ts";

export const createApi = async ({
  DATABASE_URL: databaseUrl,
  API_URL: apiUrl,
  WEB_ORIGIN: webOrigin,
  BETTER_AUTH_SECRET: authSecret,
}: Env) => {
  const orm = await createOrm({ clientUrl: databaseUrl });
  const authPool = createPool({ uri: databaseUrl, timezone: "Z" });
  const auth = createAuth({ pool: authPool, secret: authSecret, baseURL: apiUrl, webOrigin });
  const users = new BetterAuthUserRepository({ auth });

  const createNoteRepository = () => new MikroOrmNoteRepository({ em: orm.em.fork() });

  const app = createApp({
    auth,
    createContext: () => {
      const context = { notes: createNoteRepository(), users };

      return context;
    },
  });

  const close = async () => {
    await orm.close();
    await authPool.end();
  };

  const api = { fetch: app.fetch, auth, orm, createNoteRepository, close };

  return api;
};

export type Api = Awaited<ReturnType<typeof createApi>>;
