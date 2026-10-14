import { prioritySchema } from "@notes/contracts";
import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { NoteCard } from "@/components/note-card";
import { NoteDialogButton } from "@/components/note-dialog-button";
import { PriorityFilter } from "@/components/priority-filter";
import { SectionError } from "@/components/section-error";
import { redirect } from "@/i18n/navigation";
import { apiClient } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { NotesSkeleton } from "./skeletons";

type NotesSearchParams = Promise<{ priority?: string | string[] }>;

const readPriority = async (searchParams: NotesSearchParams) => {
  const { priority: requestedPriority } = await searchParams;
  const { data: priority } = prioritySchema.safeParse(requestedPriority);
  const selected = priority ?? null;

  return selected;
};

async function SessionGate() {
  const [user, locale] = await Promise.all([getCurrentUser(), getLocale()]);
  if (!user) redirect({ href: "/login", locale });

  return null;
}

async function SelectedPriorityFilter({ searchParams }: { searchParams: NotesSearchParams }) {
  const priority = await readPriority(searchParams);

  return <PriorityFilter selected={priority} />;
}

async function NotesList({ searchParams }: { searchParams: NotesSearchParams }) {
  const [user, priority, t, tPriorities] = await Promise.all([
    getCurrentUser(),
    readPriority(searchParams),
    getTranslations("notes"),
    getTranslations("priorities"),
  ]);
  if (!user) return null;

  const notes = await apiClient.notes.list(priority ? { priority } : {});

  return (
    <section aria-labelledby="notes-heading">
      <h2 id="notes-heading" className="sr-only">
        {priority ? t("filteredHeading", { priority: tPriorities(priority) }) : t("allNotes")}
      </h2>
      {notes.length === 0 ? (
        <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
          {priority ? t("emptyFiltered", { priority }) : t("emptyAll")}
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <li key={note.id}>
              <NoteCard note={note} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function NotesPage({ searchParams }: { searchParams: NotesSearchParams }) {
  const [t, tForm] = await Promise.all([getTranslations("notes"), getTranslations("noteForm")]);

  return (
    <main className="page-shell flex flex-col gap-8 py-10">
      <Suspense fallback={null}>
        <SessionGate />
      </Suspense>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="page-heading">{t("heading")}</h1>
        <div className="flex flex-wrap items-center gap-3">
          <Suspense fallback={<PriorityFilter selected={null} />}>
            <SelectedPriorityFilter searchParams={searchParams} />
          </Suspense>
          <NoteDialogButton label={tForm("add")} title={t("newNote")} />
        </div>
      </div>
      <SectionError>
        <Suspense fallback={<NotesSkeleton />}>
          <NotesList searchParams={searchParams} />
        </Suspense>
      </SectionError>
    </main>
  );
}
