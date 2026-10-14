"use server";

import { redirect } from "@/i18n/navigation";
import { toLocale } from "@/i18n/routing";
import { sendAuthRequest } from "@/lib/auth";
import {
  type AuthError,
  type AuthFormState,
  type AuthMode,
  type Credentials,
  credentialsSchema,
  getCredentialFieldErrors,
} from "@/lib/auth-form";

type AuthRequest = { credentials: Credentials; locale: string };

const readAuthError = ({ status, mode }: { status: number; mode: AuthMode }): AuthError => {
  if (status === 429) return "tooManyAttempts";
  if (status >= 500) return "serviceUnavailable";

  return mode === "register" ? "registrationFailed" : "signInFailed";
};

const authenticate = async ({ mode, credentials, locale }: AuthRequest & { mode: AuthMode }) => {
  const parsed = credentialsSchema.safeParse(credentials);
  if (!parsed.success) {
    const invalid: AuthFormState = { fieldErrors: getCredentialFieldErrors(parsed.error) };

    return invalid;
  }

  const { email, password } = parsed.data;
  const isRegistration = mode === "register";

  try {
    const response = await sendAuthRequest({
      endpoint: isRegistration ? "sign-up/email" : "sign-in/email",
      body: isRegistration ? { name: email, email, password } : { email, password },
    });
    if (!response.ok) {
      const failed: AuthFormState = { error: readAuthError({ status: response.status, mode }) };

      return failed;
    }
  } catch {
    const unavailable: AuthFormState = { error: "serviceUnavailable" };

    return unavailable;
  }

  return redirect({ href: "/", locale: toLocale(locale) });
};

export const signIn = async (request: AuthRequest) => authenticate({ ...request, mode: "signIn" });

export const register = async (request: AuthRequest) =>
  authenticate({ ...request, mode: "register" });
