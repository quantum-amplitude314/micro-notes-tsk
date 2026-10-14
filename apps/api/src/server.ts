import { serve } from "@hono/node-server";
import { createApi } from "./create-api.ts";
import { readEnv } from "./env.ts";

const env = readEnv();
const { API_URL: apiUrl } = env;
const api = await createApi(env);

const { hostname, port } = new URL(apiUrl);
const server = serve({ fetch: api.fetch, hostname, port: Number(port) }, () =>
  console.log(JSON.stringify({ message: "API listening", url: apiUrl })),
);

const shutdown = async () => {
  try {
    server.close();
    await api.close();
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error(JSON.stringify({ message: "API shutdown failed", detail }));
    process.exit(1);
  }

  process.exit(0);
};

const shutdownHandler = () => void shutdown();
process.once("SIGINT", shutdownHandler);
process.once("SIGTERM", shutdownHandler);
