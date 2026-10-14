"use client";

import { useState } from "react";
import { NoteForm } from "@/components/note-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { NoteView } from "@/lib/note-form";

export function EditNoteButton({ note }: { note: NoteView }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>Edit</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit note</DialogTitle>
        </DialogHeader>
        <NoteForm note={note} onSaved={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
