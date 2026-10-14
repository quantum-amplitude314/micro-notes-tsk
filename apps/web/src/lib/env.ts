import "server-only";

import { z } from "zod";

const envSchema = z.object({ API_URL: z.url(), WEB_ORIGIN: z.url() }).readonly();

export const getEnv = () => {
  const env = envSchema.parse(process.env);

  return env;
};
