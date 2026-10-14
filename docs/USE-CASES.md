# Use cases

## UC-1 Create a note

**Actor:** signed-in user

**Main success scenario**

1. The user enters a title, content and priority.
2. The system saves the note as owned by the user.

**Extensions**

- **2a.** The note is invalid: the system rejects it, says what is wrong, and saves nothing.

## UC-2 List notes

**Actor:** signed-in user

**Main success scenario**

1. The user asks for their notes, optionally only those with a given priority.
2. The system shows the user's own notes that match, never another user's.

## UC-3 Update a note

**Actor:** signed-in user

**Main success scenario**

1. The user changes the title, content or priority of one of their notes.
2. The system saves the changes.

**Extensions**

- **2a.** The note does not exist or belongs to another user: the system says it was not found and
  changes nothing.
- **2b.** The changes are invalid: the system rejects them, says what is wrong, and keeps the note
  as it was.

## UC-4 Delete a note

**Actor:** signed-in user

**Main success scenario**

1. The user deletes one of their notes.
2. The system removes it.

**Extensions**

- **2a.** The note does not exist or belongs to another user: the system says it was not found and
  deletes nothing.

## UC-5 Delete account

**Actor:** signed-in user

**Main success scenario**

1. The user deletes their account.
2. The system removes the account and all of the user's notes, and signs the user out.
