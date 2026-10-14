import { getMigrations } from "better-auth/db/migration";
import { createApi } from "../src/create-api.ts";
import { readEnv } from "../src/env.ts";

const api = await createApi(readEnv());

try {
  const { runMigrations } = await getMigrations(api.auth.options);
  await runMigrations();
  const applied = await api.orm.migrator.up();
  console.log(JSON.stringify({ message: "Migrations applied", notes: applied.length }));
} finally {
  await api.close();
}
