import { z } from "zod";

const envSchema = z
  .object({
    DATABASE_URL: z.url(),
    API_URL: z.url(),
    WEB_ORIGIN: z.url(),
    BETTER_AUTH_SECRET: z.string().min(32),
  })
  .readonly();

export type Env = z.infer<typeof envSchema>;

export const readEnv = () => {
  const env = envSchema.parse(process.env);

  return env;
};
