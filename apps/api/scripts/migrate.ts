import { getMigrations } from "better-auth/db/migration";
import { createOrm } from "../src/db/orm.ts";
import { readEnv } from "../src/env.ts";
import { createAuthOptions, createAuthPool } from "../src/users/auth.ts";

const {
  DATABASE_URL: databaseUrl,
  API_URL: baseURL,
  WEB_ORIGIN: webOrigin,
  BETTER_AUTH_SECRET: secret,
} = readEnv();
const pool = createAuthPool({ databaseUrl });
const orm = await createOrm({ clientUrl: databaseUrl });

try {
  const authOptions = createAuthOptions({ pool, secret, baseURL, webOrigin });
  const { runMigrations } = await getMigrations(authOptions);
  await runMigrations();
  const applied = await orm.migrator.up();
  console.log(JSON.stringify({ message: "Migrations applied", notes: applied.length }));
} finally {
  await orm.close();
  await pool.end();
}
