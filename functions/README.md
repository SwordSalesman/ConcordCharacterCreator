# Cloud Functions

Firebase Cloud Functions (v2 callables) for Waystone. Source is in `src/index.ts`, compiled to `lib/`.

| Function         | Caller                                | Purpose                                                                                       |
| ---------------- | ------------------------------------- | --------------------------------------------------------------------------------------------- |
| `submitApproval` | Reviewers (`users.role >= 3`)         | Writes the approval, clears the character's `changes`, optionally emails the player via Gmail |
| `getBandMembers` | Band owner, or reviewers              | Lists heroes whose `warband` matches the band: `id`, `player`, `heroName`                     |
| `claimThrone`    | Any signed-in user (herb-garden win)  | Records a personal-best time, updates the leaderboard and cached top 10                       |

## Approval emails

The approvals screen calls `submitApproval` instead of writing approvals from the browser. The function verifies the reviewer's role, reads the character and recipient address from Firestore, writes the approval, clears the character's `changes`, then sends the email through the Gmail API.

The approval is written **before** the email is sent. `email.status` is `pending`, `sent`, `failed` (or `not sent` when no email was requested), so a Gmail failure never loses a review. Mail is sent from the shared mailbox that authorized the OAuth app.

The frontend never sees Gmail credentials. The function reads these Firebase Secret Manager secrets at runtime:

```text
GMAIL_CLIENT_ID
GMAIL_CLIENT_SECRET
GMAIL_REFRESH_TOKEN
```

Secrets are separate for the production and development Firebase projects. Never commit their values, add them to frontend env vars, or give them a `NEXT_PUBLIC_` name.

## Build and deploy

Firebase projects (see `.firebaserc`): `development` (default, `concordcharactercreatordev`) and `production` (`concordcharactercreator`).

```sh
npm --prefix functions run build
```

Deploy to development first, test with dev data and a safe test recipient, then deploy the same source to production:

```sh
npx -y firebase-tools@latest deploy --only functions --project development
npx -y firebase-tools@latest deploy --only functions --project production
```

### Setting or rotating secrets

The CLI prompts for each value and stores it in Google Cloud Secret Manager. Use `--project production` for production:

```sh
npx -y firebase-tools@latest functions:secrets:set GMAIL_CLIENT_ID --project development
npx -y firebase-tools@latest functions:secrets:set GMAIL_CLIENT_SECRET --project development
npx -y firebase-tools@latest functions:secrets:set GMAIL_REFRESH_TOKEN --project development
```

Redeploy the functions afterwards so they pick up the new secret version.
