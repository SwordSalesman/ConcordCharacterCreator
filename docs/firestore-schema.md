# Firestore schema (draft)

> **Draft, derived from code** (`src/hooks/use-firebase.ts`, `functions/src/index.ts`, `src/components/approvals/types.ts`, `src/context/groupContext.tsx`). Firestore does not enforce any schema, and the security rules live only in the Firebase web console. Review against the live database and keep this file updated when stored data changes.

Document IDs for per-player collections are the player's Firebase Auth `uid`.

## `users/{uid}`

| Field          | Type             | Notes                                                       |
| -------------- | ---------------- | ----------------------------------------------------------- |
| `uid`          | string           |                                                             |
| `name`         | string           | Player name                                                 |
| `email`        | string           |                                                             |
| `authProvider` | `"google" \| "email"` |                                                        |
| `role`         | number           | 0-4, see AGENTS.md. Set manually in console. Email sign-up writes `1`. Google sign-up currently writes no `role` (verify) |

## `characters/{uid}`

A player's hero submission, one per player. Flat **summary format**: list fields are comma-separated strings. Type: `Character` in `src/components/approvals/types.ts`.

| Field(s)                                         | Type             | Notes                                          |
| ------------------------------------------------ | ---------------- | ---------------------------------------------- |
| `player`, `email`, `date`                        | string           | Added by `saveUserForm`. `date` is submission date |
| `heroName`, `realm`, `archetype`, `grace`        | string           |                                                |
| `gamesPlayed`                                    | number           |                                                |
| `warband`, `sect`                                | string           | Band/sect names. `getBandMembers` queries `warband` |
| `skills`, `spells`, `crafts`, `potions`, `ceremonies` | string      | Comma-separated                                |
| `startingItem`, `backstory`, `icGoals`, `oocGoals`, `comments` | string |                                          |
| `investment`, `invTier`, `invOption`, `invDiversify`, `invRegion`, `invTerritory`, `invDetails` | string / number | Investment choices |
| `changes`                                        | string \| null   | Change summary on resubmission. Cleared by `submitApproval` |

## `approvals/{uid}`

Latest review of the matching `characters/{uid}`. Written by the `submitApproval` function.

| Field     | Type                                  |
| --------- | ------------------------------------- |
| `author`  | string (reviewer name)                |
| `date`    | ISO string                            |
| `comment` | string                                |
| `status`  | `"Approved" \| "Denied" \| "Archived"` |
| `email`   | `{ status: "pending" \| "sent" \| "not sent" \| "failed", sentAt: string, failedAt: string, gmailMessageId: string \| null }` |

## `bands/{uid}` and `sects/{uid}`

Group submission, keyed by the owner's uid. Type: `GroupState` in `src/context/groupContext.tsx`.

`date`, `type`, `realm`, `name`, `archetypeDetails` (shape varies by archetype), `visuals`, `history`, `oath`, `goals`, `enterprise`.

## `bandApprovals/{uid}` and `sectApprovals/{uid}`

Review of a group submission: `date` plus the approval fields from the group context (`GroupContext` `approval` record).

## `public/groupList`

`{ bands: { name, realm }[], sects: { name, realm }[], date }`. Written by admin tooling (`saveGroupList`).

## `public/herbGardenTop10`

`{ entries: ThroneLeaderboardEntry[], updatedAt: ISO string }`. Cache written by `claimThrone`.

## `herbGardenScores/{uid}`

Personal-best herb garden time. Written by `claimThrone`: `{ uid, displayName, timeMs, achievedAt }`.

## Open questions

- Which of these should be readable by non-owners (rules)? Reviewer role checks are done in the console rules and in functions.
- Should `users.role` be defaulted for Google sign-ups?
- Should lists in `characters` move to real arrays?
