"use client";

import { useLocale, useTranslations } from "next-intl";
import { type SubmitEvent, useState, useTransition } from "react";
import { register, signIn } from "@/app/auth-actions";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import {
  type AuthFormState,
  type AuthMode,
  type Credentials,
  credentialsSchema,
  getCredentialFieldErrors,
} from "@/lib/auth-form";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const isRegistration = mode === "register";
  const [credentials, setCredentials] = useState<Credentials>({ email: "", password: "" });
  const [feedback, setFeedback] = useState<AuthFormState>({});
  const [pending, startTransition] = useTransition();
  const { error, fieldErrors } = feedback;
  const emailError = fieldErrors?.email && t(`validation.${fieldErrors.email}`);
  const passwordError = fieldErrors?.password && t(`validation.${fieldErrors.password}`);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = credentialsSchema.safeParse(credentials);
    if (!parsed.success)
      return setFeedback({ fieldErrors: getCredentialFieldErrors(parsed.error) });

    startTransition(async () => {
      const send = isRegistration ? register : signIn;
      setFeedback(await send({ credentials, locale }));
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6" aria-busy={pending}>
      <FieldGroup>
        <Field data-invalid={!!emailError}>
          <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={credentials.email}
            readOnly={pending}
            onChange={(event) => setCredentials({ ...credentials, email: event.target.value })}
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "email-error" : undefined}
          />
          <FieldError id="email-error">{emailError}</FieldError>
        </Field>
        <Field data-invalid={!!passwordError}>
          <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
          <Input
            id="password"
            type="password"
            autoComplete={isRegistration ? "new-password" : "current-password"}
            required
            minLength={8}
            maxLength={128}
            value={credentials.password}
            readOnly={pending}
            onChange={(event) => setCredentials({ ...credentials, password: event.target.value })}
            aria-invalid={!!passwordError}
            aria-describedby={passwordError ? "password-error" : undefined}
          />
          <FieldError id="password-error">{passwordError}</FieldError>
        </Field>
      </FieldGroup>
      <FieldError role="alert">{error && !pending ? t(`errors.${error}`) : null}</FieldError>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? t("pending") : isRegistration ? t("createAccount") : t("signIn")}
      </Button>
      <p className="text-sm text-muted-foreground">
        {t.rich(isRegistration ? "toSignIn" : "toRegister", {
          link: (chunks) => (
            <Link
              href={isRegistration ? "/login" : "/register"}
              className="font-medium text-foreground underline underline-offset-4"
            >
              {chunks}
            </Link>
          ),
        })}
      </p>
    </form>
  );
}
