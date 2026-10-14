# Domain

## User

A person who signs in with an email and password. Credentials and sessions belong to
authentication, not to the domain.

| Field | Rule |
|---|---|
| id | assigned at registration, never changes |
| email | unique, used to sign in |

## Note

| Field | Rule |
|---|---|
| id | assigned when the note is created, never changes |
| owner | the user who created the note, never changes |
| title | required; surrounding whitespace is ignored; at most 200 characters |
| content | may be empty; surrounding whitespace is ignored; at most 10,000 characters |
| priority | required; one of `low`, `medium`, `high` |
| created at | set once, when the note is created |
| updated at | set when the note is created and on every change |

## Rules

- **Ownership:** only the owner can see, change or delete a note (UC-2, UC-3, UC-4). To anyone
  else, the note does not exist.
- **Account deletion:** deleting a user deletes all of their notes (UC-5).
- **Validation:** a note that breaks a field rule is rejected (UC-1 2a, UC-3 2b) with one of
  these errors:
  - **title required**: the title is missing or blank.
  - **title too long**: the title has more than 200 characters.
  - **content too long**: the content has more than 10,000 characters.
  - **priority required**: the priority is missing or not one of the three.
