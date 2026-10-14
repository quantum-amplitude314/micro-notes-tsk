import assert from "node:assert/strict";
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

describe("UC-5 Delete account", () => {
  test("precondition: rejects a user who is not signed in", async () => {
    const response = await call({ api, path: "/account", method: "DELETE" });

    assert.equal(response.status, 401);
  });

  test("main success scenario: removes the account and all of the user's notes, and signs the user out", async () => {
    const user = await signUp({ api });
    const otherUser = await signUp({ api });
    await seedNote({ api, ownerId: user.id, note: { ...validNote, title: "First" } });
    await seedNote({ api, ownerId: user.id, note: { ...validNote, title: "Second" } });
    const othersNote = await seedNote({ api, ownerId: otherUser.id, note: validNote });

    const response = await call({
      api,
      path: "/account",
      method: "DELETE",
      cookie: user.cookie,
    });

    assert.equal(response.status, 204);
    const listAfterDeletion = await call({ api, path: "/notes", cookie: user.cookie });
    assert.equal(listAfterDeletion.status, 401);
    const signIn = await call({
      api,
      path: "/auth/sign-in/email",
      method: "POST",
      body: { email: user.email, password: user.password },
    });
    assert.equal(signIn.status, 401);
    assert.deepEqual(await storedNotes({ api, ownerId: user.id }), []);
    assert.deepEqual(await storedNotes({ api, ownerId: otherUser.id }), [othersNote]);
  });
});
