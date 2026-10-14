import { betterAuth } from "better-auth";
import type { Pool } from "mysql2/promise";

export const createAuth = ({
  pool,
  secret,
  baseURL,
  webOrigin,
}: {
  pool: Pool;
  secret: string;
  baseURL: string;
  webOrigin: string;
}) => {
  const auth = betterAuth({
    appName: "Notes",
    baseURL,
    basePath: "/auth",
    secret,
    trustedOrigins: [webOrigin],
    database: pool,
    emailAndPassword: { enabled: true, minPasswordLength: 8, maxPasswordLength: 128 },
    session: { expiresIn: 60 * 60 * 24 * 7, disableSessionRefresh: true },
  });

  return auth;
};

export type Auth = ReturnType<typeof createAuth>;
