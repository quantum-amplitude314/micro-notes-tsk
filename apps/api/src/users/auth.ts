import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@notes/contracts";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { createPool, type Pool } from "mysql2/promise";

type AuthSettings = { pool: Pool; secret: string; baseURL: string; webOrigin: string };

export const createAuthPool = ({ databaseUrl }: { databaseUrl: string }) => {
  const pool = createPool({ uri: databaseUrl, timezone: "Z" });

  return pool;
};

export const createAuthOptions = ({ pool, secret, baseURL, webOrigin }: AuthSettings) => {
  const options = {
    appName: "Micro Notes",
    baseURL,
    basePath: "/auth",
    secret,
    trustedOrigins: [webOrigin],
    database: pool,
    emailAndPassword: {
      enabled: true,
      minPasswordLength: PASSWORD_MIN_LENGTH,
      maxPasswordLength: PASSWORD_MAX_LENGTH,
    },
    session: { expiresIn: 60 * 60 * 24 * 7, disableSessionRefresh: true },
  } satisfies BetterAuthOptions;

  return options;
};

export const createAuth = (settings: AuthSettings) => {
  const auth = betterAuth(createAuthOptions(settings));

  return auth;
};

export type Auth = ReturnType<typeof createAuth>;
