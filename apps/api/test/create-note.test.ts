import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import type { Api } from "../src/create-api.ts";
import {
  call,
  fieldsOf,
  invalidNotes,
  readFirstErrorPerField,
  readNote,
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

describe("UC-1 Create a note", () => {
  test("precondition: rejects a user who is not signed in", async () => {
    const response = await call({ api, path: "/notes", method: "POST", body: validNote });

    assert.equal(response.status, 401);
  });

  test("main success scenario: saves the note as owned by the user", async () => {
    const user = await signUp({ api });

    const response = await call({
      api,
      path: "/notes",
      method: "POST",
      body: validNote,
      cookie: user.cookie,
    });

    assert.equal(response.status, 201);
    const note = await readNote(response);
    assert.deepEqual(fieldsOf(note), validNote);
    const stored = await storedNotes({ api, ownerId: user.id });
    assert.deepEqual(
      stored.map(({ id }) => id),
      [note.id],
    );
  });

  test("main success scenario: ignores surrounding whitespace and accepts empty content", async () => {
    const user = await signUp({ api });

    const response = await call({
      api,
      path: "/notes",
      method: "POST",
      body: { title: "  Groceries  ", content: "   ", priority: "low" },
      cookie: user.cookie,
    });

    assert.equal(response.status, 201);
    const note = await readNote(response);
    assert.deepEqual(fieldsOf(note), { title: "Groceries", content: "", priority: "low" });
  });

  for (const { violation, input, fieldErrors } of invalidNotes) {
    test(`2a: rejects an invalid note (${violation}), says what is wrong and saves nothing`, async () => {
      const user = await signUp({ api });

      const response = await call({
        api,
        path: "/notes",
        method: "POST",
        body: input,
        cookie: user.cookie,
      });

      assert.equal(response.status, 400);
      assert.deepEqual(await readFirstErrorPerField(response), fieldErrors);
      assert.deepEqual(await storedNotes({ api, ownerId: user.id }), []);
    });
  }
});
