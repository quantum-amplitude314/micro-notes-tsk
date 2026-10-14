import { prioritySchema } from "@notes/contracts";
import { redirect } from "next/navigation";
import { NoteCard } from "@/components/note-card";
import { NoteForm } from "@/components/note-form";
import { PriorityFilter } from "@/components/priority-filter";
import { SiteHeader } from "@/components/site-header";
import { apiClient } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { priorityLabels } from "@/lib/priority";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ priority?: string | string[] }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { priority: requestedPriority } = await searchParams;
  const { data: priority } = prioritySchema.safeParse(requestedPriority);
  const notes = await apiClient.notes.list(priority ? { priority } : {});

  return (
    <>
      <SiteHeader email={user.email} />
      <main className="page-shell flex flex-col gap-10 py-10">
        <h1 className="page-heading">Your notes</h1>
        <section
          aria-labelledby="new-note-heading"
          className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm"
        >
          <h2 id="new-note-heading" className="section-heading">
            New note
          </h2>
          <NoteForm />
        </section>
        <section aria-labelledby="notes-heading" className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="notes-heading" className="section-heading">
              {priority ? `${priorityLabels[priority]} priority` : "All notes"}
            </h2>
            <PriorityFilter selected={priority ?? null} />
          </div>
          {notes.length === 0 ? (
            <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
              {priority
                ? `No notes with ${priorityLabels[priority].toLowerCase()} priority.`
                : "You have no notes yet. Write your first one above."}
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {notes.map((note) => (
                <li key={note.id}>
                  <NoteCard note={note} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
