"use server";

import { redirect } from "@/i18n/navigation";
import { toLocale } from "@/i18n/routing";
import { apiClient, hasStatus } from "@/lib/api";
import { clearSessionCookies, sendAuthRequest } from "@/lib/auth";

export const signOut = async ({ locale }: { locale: string }) => {
  try {
    await sendAuthRequest({ endpoint: "sign-out", body: {} });
  } catch {}

  await clearSessionCookies();

  return redirect({ href: "/login", locale: toLocale(locale) });
};

export const deleteAccount = async ({ locale }: { locale: string }) => {
  try {
    await apiClient.account.delete();
  } catch (error) {
    if (!hasStatus({ error, status: 401 })) {
      const failed = { deleted: false };

      return failed;
    }
  }

  await clearSessionCookies();

  return redirect({ href: "/register", locale: toLocale(locale) });
};
