"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";

type ConfirmDialogContent = {
  title: string;
  description: string;
  confirmLabel: string;
  failureMessage: string;
  onConfirm: () => Promise<{ deleted: boolean } | undefined>;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  failureMessage,
  onConfirm,
}: ConfirmDialogContent & { open: boolean; onOpenChange: (open: boolean) => void }) {
  const t = useTranslations("dialog");
  const [failed, setFailed] = useState(false);
  const [pending, startTransition] = useTransition();

  const confirm = () =>
    startTransition(async () => {
      const result = await onConfirm();
      const succeeded = result?.deleted ?? true;
      setFailed(!succeeded);
      if (succeeded) onOpenChange(false);
    });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        setFailed(false);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <FieldError role="alert">{failed && !pending ? failureMessage : null}</FieldError>
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="ghost" disabled={pending} />}>
            {t("cancel")}
          </DialogClose>
          <Button type="button" variant="destructive" disabled={pending} onClick={confirm}>
            {pending ? t("deleting") : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ConfirmDialogButton({
  triggerLabel,
  ...content
}: ConfirmDialogContent & { triggerLabel: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      <ConfirmDialog open={open} onOpenChange={setOpen} {...content} />
    </>
  );
}
