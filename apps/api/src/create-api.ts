import { createPool } from "mysql2/promise";
import { createAuth } from "./auth/auth.ts";
import { createOrm } from "./db/orm.ts";
import type { Env } from "./env.ts";
import { createApp } from "./http/app.ts";
import { deleteOwnedNotes } from "./use-cases/delete-owned-notes.ts";

export const createApi = async ({
  DATABASE_URL: databaseUrl,
  API_URL: apiUrl,
  WEB_ORIGIN: webOrigin,
  BETTER_AUTH_SECRET: authSecret,
}: Env) => {
  const orm = await createOrm({ clientUrl: databaseUrl });
  const authPool = createPool({ uri: databaseUrl, timezone: "Z" });
  const auth = createAuth({
    pool: authPool,
    secret: authSecret,
    baseURL: apiUrl,
    webOrigin,
    beforeDeleteUser: ({ userId }) => deleteOwnedNotes({ em: orm.em.fork(), ownerId: userId }),
  });
  const app = createApp({ auth, forkEm: () => orm.em.fork() });

  const close = async () => {
    await orm.close();
    await authPool.end();
  };

  const api = { fetch: app.fetch, auth, orm, close };

  return api;
};

export type Api = Awaited<ReturnType<typeof createApi>>;
