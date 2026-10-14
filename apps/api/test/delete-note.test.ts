import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, describe, test } from "node:test";
import type { Api } from "../src/create-api.ts";
import { call, seedNote, signUp, startApi, storedNotes, validNote } from "./helpers.ts";

let api: Api;

before(async () => {
  api = await startApi();
});

after(async () => {
  await api.close();
});

describe("UC-4 Delete a note", () => {
  test("precondition: rejects a user who is not signed in", async () => {
    const response = await call({ api, path: `/notes/${randomUUID()}`, method: "DELETE" });

    assert.equal(response.status, 401);
  });

  test("main success scenario: removes the note", async () => {
    const user = await signUp({ api });
    const kept = await seedNote({ api, ownerId: user.id, note: { ...validNote, title: "Keep" } });
    const deleted = await seedNote({
      api,
      ownerId: user.id,
      note: { ...validNote, title: "Drop" },
    });

    const response = await call({
      api,
      path: `/notes/${deleted.id}`,
      method: "DELETE",
      cookie: user.cookie,
    });

    assert.equal(response.status, 204);
    assert.deepEqual(await storedNotes({ api, ownerId: user.id }), [kept]);
  });

  test("2a: says a note that does not exist was not found", async () => {
    const user = await signUp({ api });

    const response = await call({
      api,
      path: `/notes/${randomUUID()}`,
      method: "DELETE",
      cookie: user.cookie,
    });

    assert.equal(response.status, 404);
  });

  test("2a: says another user's note was not found and deletes nothing", async () => {
    const owner = await signUp({ api });
    const intruder = await signUp({ api });
    const seeded = await seedNote({ api, ownerId: owner.id, note: validNote });

    const response = await call({
      api,
      path: `/notes/${seeded.id}`,
      method: "DELETE",
      cookie: intruder.cookie,
    });

    assert.equal(response.status, 404);
    assert.deepEqual(await storedNotes({ api, ownerId: owner.id }), [seeded]);
  });
});
