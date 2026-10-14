import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import type { Api } from "../src/create-api.ts";
import { call, readNotes, seedNote, signUp, startApi, titlesOf, validNote } from "./helpers.ts";

let api: Api;

before(async () => {
  api = await startApi();
});

after(async () => {
  await api.close();
});

describe("UC-2 List notes", () => {
  test("precondition: rejects a user who is not signed in", async () => {
    const response = await call({ api, path: "/notes" });

    assert.equal(response.status, 401);
  });

  test("main success scenario: shows the user's own notes, never another user's", async () => {
    const user = await signUp({ api });
    const otherUser = await signUp({ api });
    await seedNote({ api, ownerId: user.id, note: { ...validNote, title: "Mine" } });
    await seedNote({ api, ownerId: user.id, note: { ...validNote, title: "Also mine" } });
    await seedNote({ api, ownerId: otherUser.id, note: { ...validNote, title: "Theirs" } });

    const response = await call({ api, path: "/notes", cookie: user.cookie });

    assert.equal(response.status, 200);
    assert.deepEqual(titlesOf(await readNotes(response)), ["Also mine", "Mine"]);
  });

  test("main success scenario: shows only the notes with the given priority", async () => {
    const user = await signUp({ api });
    const otherUser = await signUp({ api });
    await seedNote({
      api,
      ownerId: user.id,
      note: { ...validNote, title: "Urgent", priority: "high" },
    });
    await seedNote({
      api,
      ownerId: user.id,
      note: { ...validNote, title: "Someday", priority: "low" },
    });
    await seedNote({
      api,
      ownerId: otherUser.id,
      note: { ...validNote, title: "Theirs", priority: "high" },
    });

    const response = await call({ api, path: "/notes?priority=high", cookie: user.cookie });

    assert.equal(response.status, 200);
    assert.deepEqual(titlesOf(await readNotes(response)), ["Urgent"]);
  });
});
