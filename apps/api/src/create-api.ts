import { notImplemented } from "./not-implemented.ts";

export const createApi = async () => {
  const fetch = async (_: Request): Promise<Response> => notImplemented();
  const close = async () => {};

  const api = { fetch, close };

  return api;
};

export type Api = Awaited<ReturnType<typeof createApi>>;
