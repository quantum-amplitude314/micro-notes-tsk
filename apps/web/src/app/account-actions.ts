"use server";

import { redirect } from "next/navigation";
import { apiClient, hasStatus } from "@/lib/api";
import { clearSessionCookies, sendAuthRequest } from "@/lib/auth";

export const signOut = async () => {
  try {
    await sendAuthRequest({ endpoint: "sign-out", body: {} });
  } finally {
    await clearSessionCookies();
  }

  redirect("/login");
};

export const deleteAccount = async () => {
  try {
    await apiClient.account.delete();
  } catch (error) {
    if (!hasStatus({ error, status: 401 })) {
      const failed = { deleted: false };

      return failed;
    }
  }

  await clearSessionCookies();
  redirect("/register");
};
