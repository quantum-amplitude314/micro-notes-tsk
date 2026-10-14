"use client";

import type { VariantProps } from "class-variance-authority";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { NoteForm } from "@/components/note-form";
import { Button, type buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { NoteView } from "@/lib/note-form";

export function NoteDialogButton({
  note,
  label,
  title,
  variant,
  size,
}: {
  note?: NoteView;
  label: string;
  title: string;
} & VariantProps<typeof buttonVariants>) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {note ? (
        <DialogTrigger
          render={<Button variant={variant} size={size} aria-label={label} title={label} />}
        >
          <Pencil aria-hidden="true" />
        </DialogTrigger>
      ) : (
        <DialogTrigger render={<Button variant={variant} size={size} />}>
          <Plus aria-hidden="true" />
          {label}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {note ? (
          <NoteForm note={note} onSaved={() => setOpen(false)} />
        ) : (
          <NoteForm onSaved={() => setOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
