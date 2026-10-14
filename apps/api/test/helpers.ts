import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { prioritySchema } from "@notes/contracts";
import { z } from "zod";
import { type Api, createApi } from "../src/create-api.ts";
import { Note } from "../src/db/note.entity.ts";
import { readEnv } from "../src/env.ts";

const env = readEnv();
const { API_URL: baseUrl, WEB_ORIGIN: webOrigin } = env;
const password = "correct-horse-battery";

export type NoteFields = { title: string; content: string; priority: string };

export type StoredNote = NoteFields & { id: string; createdAt: Date; updatedAt: Date };

export const validNote: NoteFields = {
  title: "Groceries",
  content: "Milk and bread",
  priority: "high",
};

export const invalidNotes = [
  {
    violation: "title required, missing",
    input: { content: "Milk and bread", priority: "high" },
    fieldErrors: { title: "titleRequired" },
  },
  {
    violation: "title required, blank",
    input: { ...validNote, title: "   " },
    fieldErrors: { title: "titleRequired" },
  },
  {
    violation: "title too long",
    input: { ...validNote, title: "x".repeat(201) },
    fieldErrors: { title: "titleTooLong" },
  },
  {
    violation: "content too long",
    input: { ...validNote, content: "x".repeat(10_001) },
    fieldErrors: { content: "contentTooLong" },
  },
  {
    violation: "priority required, missing",
    input: { title: "Groceries", content: "Milk and bread" },
    fieldErrors: { priority: "priorityRequired" },
  },
  {
    violation: "priority required, unknown",
    input: { ...validNote, priority: "urgent" },
    fieldErrors: { priority: "priorityRequired" },
  },
];

export const startApi = () => createApi(env);

export const call = async ({
  api,
  path,
  method = "GET",
  body,
  cookie,
}: {
  api: Api;
  path: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  cookie?: string;
}) => {
  const headers = new Headers({ Origin: webOrigin });
  if (body !== undefined) headers.set("Content-Type", "application/json");
  if (cookie) headers.set("Cookie", cookie);
  const init =
    body === undefined ? { method, headers } : { method, headers, body: JSON.stringify(body) };
  const response = await api.fetch(new Request(new URL(path, baseUrl), init));

  return response;
};

const readSessionCookie = ({ response }: { response: Response }) => {
  const cookie = response.headers
    .getSetCookie()
    .map((header) => header.split(";")[0])
    .join("; ");

  return cookie;
};

const signUpResponseSchema = z.object({ user: z.object({ id: z.string() }) });

export const signUp = async ({ api }: { api: Api }) => {
  const email = `user-${randomUUID()}@example.com`;
  const response = await call({
    api,
    path: "/auth/sign-up/email",
    method: "POST",
    body: { name: email, email, password },
  });
  assert.equal(response.status, 200, "sign-up failed");
  const { user } = signUpResponseSchema.parse(await response.json());
  const account = { id: user.id, email, password, cookie: readSessionCookie({ response }) };

  return account;
};

const noteJsonSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  priority: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const readNote = async (response: Response) => {
  const note = noteJsonSchema.parse(await response.json());

  return note;
};

export const readNotes = async (response: Response) => {
  const notes = z.array(noteJsonSchema).parse(await response.json());

  return notes;
};

export const fieldsOf = ({ title, content, priority }: NoteFields) => {
  const fields = { title, content, priority };

  return fields;
};

export const titlesOf = (notes: NoteFields[]) => {
  const titles = notes.map(({ title }) => title).sort();

  return titles;
};

const validationErrorSchema = z.object({
  data: z.object({
    issues: z.array(
      z.object({ path: z.array(z.union([z.string(), z.number()])), message: z.string() }),
    ),
  }),
});

export const readFirstErrorPerField = async (response: Response) => {
  const { data } = validationErrorSchema.parse(await response.json());
  const fieldErrors: Record<string, string> = {};
  for (const { path, message } of data.issues) fieldErrors[String(path[0])] ??= message;

  return fieldErrors;
};

const toStoredNote = ({ id, title, content, priority, createdAt, updatedAt }: StoredNote) => {
  const storedNote = { id, title, content, priority, createdAt, updatedAt };

  return storedNote;
};

export const seedNote = async ({
  api,
  ownerId,
  note,
}: {
  api: Api;
  ownerId: string;
  note: NoteFields;
}) => {
  const em = api.orm.em.fork();
  const { title, content, priority: rawPriority } = note;
  const priority = prioritySchema.parse(rawPriority);
  const seeded = em.create(Note, { ownerId, title, content, priority });
  await em.flush();
  const storedNote = toStoredNote(seeded);

  return storedNote;
};

export const storedNotes = async ({ api, ownerId }: { api: Api; ownerId: string }) => {
  const em = api.orm.em.fork();
  const notes = await em.find(Note, { ownerId }, { orderBy: { createdAt: "asc" } });
  const stored = notes.map(toStoredNote);

  return stored;
};
