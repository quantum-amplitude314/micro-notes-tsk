import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, describe, test } from "node:test";
import type { Api } from "../src/create-api.ts";
import {
  call,
  fieldsOf,
  invalidNotes,
  readFirstErrorPerField,
  readNote,
  seedNote,
  signUp,
  startApi,
  storedNotes,
  validNote,
} from "./helpers.ts";

let api: Api;

before(async () => {
  api = await startApi();
});

after(async () => {
  await api.close();
});

const changes = {
  title: "Groceries for Sunday",
  content: "Milk, bread and eggs",
  priority: "medium",
};

describe("UC-3 Update a note", () => {
  test("precondition: rejects a user who is not signed in", async () => {
    const response = await call({
      api,
      path: `/notes/${randomUUID()}`,
      method: "PUT",
      body: changes,
    });

    assert.equal(response.status, 401);
  });

  test("main success scenario: saves the changes", async () => {
    const user = await signUp({ api });
    const seeded = await seedNote({ api, ownerId: user.id, note: validNote });

    const response = await call({
      api,
      path: `/notes/${seeded.id}`,
      method: "PUT",
      body: changes,
      cookie: user.cookie,
    });

    assert.equal(response.status, 200);
    assert.deepEqual(fieldsOf(await readNote(response)), changes);
    const [stored] = await storedNotes({ api, ownerId: user.id });
    assert.ok(stored);
    assert.deepEqual(fieldsOf(stored), changes);
    assert.deepEqual(stored.createdAt, seeded.createdAt);
    assert.ok(stored.updatedAt > seeded.updatedAt);
  });

  test("2a: says a note that does not exist was not found", async () => {
    const user = await signUp({ api });

    const response = await call({
      api,
      path: `/notes/${randomUUID()}`,
      method: "PUT",
      body: changes,
      cookie: user.cookie,
    });

    assert.equal(response.status, 404);
  });

  test("2a: says another user's note was not found and changes nothing", async () => {
    const owner = await signUp({ api });
    const intruder = await signUp({ api });
    const seeded = await seedNote({ api, ownerId: owner.id, note: validNote });

    const response = await call({
      api,
      path: `/notes/${seeded.id}`,
      method: "PUT",
      body: changes,
      cookie: intruder.cookie,
    });

    assert.equal(response.status, 404);
    assert.deepEqual(await storedNotes({ api, ownerId: owner.id }), [seeded]);
  });

  for (const { violation, input, fieldErrors } of invalidNotes) {
    test(`2b: rejects invalid changes (${violation}), says what is wrong and keeps the note`, async () => {
      const user = await signUp({ api });
      const seeded = await seedNote({ api, ownerId: user.id, note: validNote });

      const response = await call({
        api,
        path: `/notes/${seeded.id}`,
        method: "PUT",
        body: input,
        cookie: user.cookie,
      });

      assert.equal(response.status, 400);
      assert.deepEqual(await readFirstErrorPerField(response), fieldErrors);
      assert.deepEqual(await storedNotes({ api, ownerId: user.id }), [seeded]);
    });
  }
});
