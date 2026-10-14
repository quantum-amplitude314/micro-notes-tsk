import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth";

export async function RedirectIfSignedIn() {
  const [user, locale] = await Promise.all([getCurrentUser().catch(() => null), getLocale()]);
  if (user) redirect({ href: "/", locale });

  return null;
}
