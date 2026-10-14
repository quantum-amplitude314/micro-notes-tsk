import "server-only";

import { parseSetCookieHeader, toCookieOptions } from "better-auth/cookies";
import { cookies } from "next/headers";
import { cache } from "react";
import { z } from "zod";
import { getEnv } from "@/lib/env";
import { hasSessionCookie, SESSION_COOKIE_NAMES } from "@/lib/session-cookie";

const sessionSchema = z
  .object({ user: z.object({ id: z.string(), email: z.string() }) })
  .nullable();

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  if (!hasSessionCookie(cookieStore)) return null;

  const { API_URL: apiUrl } = getEnv();
  const response = await fetch(new URL("/auth/get-session", apiUrl), {
    headers: { cookie: cookieStore.toString() },
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to load your account. Please try again.");

  const session = sessionSchema.parse(await response.json());
  const user = session?.user ?? null;

  return user;
});

export const sendAuthRequest = async ({
  endpoint,
  body,
}: {
  endpoint: "sign-in/email" | "sign-up/email" | "sign-out";
  body: Record<string, unknown>;
}) => {
  const cookieStore = await cookies();
  const { API_URL: apiUrl, WEB_ORIGIN: webOrigin } = getEnv();
  const request = new Request(new URL(`/auth/${endpoint}`, apiUrl), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: webOrigin,
      Cookie: cookieStore.toString(),
    },
    body: JSON.stringify(body),
  });
  const response = await fetch(request, { cache: "no-store" });

  for (const header of response.headers.getSetCookie()) {
    for (const [name, attributes] of parseSetCookieHeader(header)) {
      const { value } = attributes;
      cookieStore.set(name, value, toCookieOptions(attributes));
    }
  }

  return response;
};

export const clearSessionCookies = async () => {
  const cookieStore = await cookies();
  for (const name of SESSION_COOKIE_NAMES) cookieStore.delete(name);
};
