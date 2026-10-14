import { z } from "zod";

const credentialErrorSchema = z.enum(["emailInvalid", "passwordTooShort", "passwordTooLong"]);
type CredentialError = z.infer<typeof credentialErrorSchema>;
const { enum: credentialErrors } = credentialErrorSchema;

const credentialFieldSchema = z.enum(["email", "password"]);
type CredentialField = z.infer<typeof credentialFieldSchema>;
export type CredentialFieldErrors = Partial<Record<CredentialField, CredentialError>>;

export const credentialsSchema = z.object({
  email: z
    .string({ error: credentialErrors.emailInvalid })
    .trim()
    .pipe(z.email({ error: credentialErrors.emailInvalid })),
  password: z
    .string({ error: credentialErrors.passwordTooShort })
    .min(8, { error: credentialErrors.passwordTooShort })
    .max(128, { error: credentialErrors.passwordTooLong }),
});

export type Credentials = { email: string; password: string };

export type AuthMode = "signIn" | "register";

export type AuthError =
  | "signInFailed"
  | "registrationFailed"
  | "tooManyAttempts"
  | "serviceUnavailable";

export type AuthFormState = { error?: AuthError; fieldErrors?: CredentialFieldErrors };

export const getCredentialFieldErrors = ({ issues }: z.ZodError) => {
  const fieldErrors: CredentialFieldErrors = {};

  for (const { path, message } of issues) {
    const field = credentialFieldSchema.safeParse(path[0]);
    const error = credentialErrorSchema.safeParse(message);
    if (!field.success || !error.success) continue;
    fieldErrors[field.data] ??= error.data;
  }

  return fieldErrors;
};
