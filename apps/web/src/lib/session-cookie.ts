export const SESSION_COOKIE_NAMES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
];

export const hasSessionCookie = (cookies: { has: (name: string) => boolean }) =>
  SESSION_COOKIE_NAMES.some((name) => cookies.has(name));
