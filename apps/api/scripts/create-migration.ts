import { createOrm } from "../src/db/orm.ts";
import { readEnv } from "../src/env.ts";

const { DATABASE_URL: databaseUrl } = readEnv();
const [name] = process.argv.slice(2);
const orm = await createOrm({ clientUrl: databaseUrl });

try {
  const { fileName, diff } = await orm.migrator.create(undefined, false, false, name);
  const result = fileName
    ? { message: "Migration created", fileName, statements: diff.up.length }
    : { message: "Schema is up to date, no migration created" };
  console.log(JSON.stringify(result));
} finally {
  await orm.close();
}
