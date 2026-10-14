"use server";

import { redirect } from "next/navigation";
import { sendAuthRequest } from "@/lib/auth";
import {
  type AuthError,
  type AuthFormState,
  type AuthMode,
  type Credentials,
  credentialsSchema,
  getCredentialFieldErrors,
} from "@/lib/auth-form";

const readAuthError = ({ status, mode }: { status: number; mode: AuthMode }): AuthError => {
  if (status === 429) return "tooManyAttempts";
  if (status >= 500) return "serviceUnavailable";

  return mode === "register" ? "registrationFailed" : "signInFailed";
};

const authenticate = async ({
  mode,
  credentials,
}: {
  mode: AuthMode;
  credentials: Credentials;
}) => {
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

  redirect("/");
};

export const signIn = async ({ credentials }: { credentials: Credentials }) =>
  authenticate({ mode: "signIn", credentials });

export const register = async ({ credentials }: { credentials: Credentials }) =>
  authenticate({ mode: "register", credentials });
