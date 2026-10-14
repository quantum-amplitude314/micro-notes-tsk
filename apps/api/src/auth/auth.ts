import { betterAuth } from "better-auth";
import type { Pool } from "mysql2/promise";

export const createAuth = ({
  pool,
  secret,
  baseURL,
  webOrigin,
  beforeDeleteUser,
}: {
  pool: Pool;
  secret: string;
  baseURL: string;
  webOrigin: string;
  beforeDeleteUser: ({ userId }: { userId: string }) => Promise<void>;
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
    user: {
      deleteUser: {
        enabled: true,
        beforeDelete: ({ id }) => beforeDeleteUser({ userId: id }),
      },
    },
  });

  return auth;
};

export type Auth = ReturnType<typeof createAuth>;
