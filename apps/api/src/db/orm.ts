import { fileURLToPath } from "node:url";
import { defineConfig, MikroORM } from "@mikro-orm/mariadb";
import { Migrator } from "@mikro-orm/migrations";
import { NoteEntity } from "../notes/note.entity.ts";

const migrationsPath = fileURLToPath(new URL("../../migrations", import.meta.url));
const authTables = ["user", "session", "account", "verification"];

export const createOrm = async ({ clientUrl }: { clientUrl: string }) => {
  const config = defineConfig({
    clientUrl,
    timezone: "+00:00",
    entities: [NoteEntity],
    extensions: [Migrator],
    migrations: { path: migrationsPath, glob: "!(*.d).ts", emit: "ts", snapshotName: ".snapshot" },
    schemaGenerator: { skipTables: authTables },
  });

  const orm = await MikroORM.init(config);

  return orm;
};
