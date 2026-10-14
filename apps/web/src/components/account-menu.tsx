"use client";

import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { deleteAccount, signOut } from "@/app/account-actions";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { LocaleMenu } from "@/components/locale-switcher";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AccountMenu({ email, version }: { email: string; version: string }) {
  const locale = useLocale();
  const t = useTranslations("header");
  const [confirmingDeletion, setConfirmingDeletion] = useState(false);
  const [signingOut, startSignOut] = useTransition();

  const handleSignOut = () => startSignOut(() => signOut({ locale }));

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className={buttonVariants({ variant: "outline" })}>
          {t("myAccount")}
          <ChevronDown aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} className="w-64 max-w-[calc(100vw-2rem)]">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="truncate font-normal">{email}</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <LocaleMenu />
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive" onClick={() => setConfirmingDeletion(true)}>
              {t("deleteAccount")}
            </DropdownMenuItem>
            <DropdownMenuItem closeOnClick={false} disabled={signingOut} onClick={handleSignOut}>
              {signingOut ? t("signingOut") : t("signOut")}
              <span className="ml-auto text-xs text-muted-foreground tabular-nums">{version}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={confirmingDeletion}
        onOpenChange={setConfirmingDeletion}
        title={t("deleteAccountTitle")}
        description={t("deleteAccountDescription")}
        confirmLabel={t("deleteAccount")}
        failureMessage={t("deleteAccountFailed")}
        onConfirm={() => deleteAccount({ locale })}
      />
    </>
  );
}
