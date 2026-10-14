import { deleteAccount, signOut } from "@/app/account-actions";
import { ConfirmDialogButton } from "@/components/confirm-dialog-button";
import { Button } from "@/components/ui/button";

export function SiteHeader({ email }: { email: string }) {
  return (
    <header className="border-b bg-card">
      <div className="page-shell flex flex-wrap items-center justify-between gap-3 py-4">
        <p className="font-heading text-xl font-medium">Notes</p>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="max-w-48 truncate text-sm text-muted-foreground">{email}</span>
          <form action={signOut}>
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
          <ConfirmDialogButton
            triggerLabel="Delete account"
            title="Delete your account?"
            description="Your account and all of your notes will be deleted. This can't be undone."
            confirmLabel="Delete account"
            failureMessage="The account could not be deleted. Please try again."
            onConfirm={deleteAccount}
          />
        </div>
      </div>
    </header>
  );
}
