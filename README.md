# Waystone

Waystone (formerly the Concord Character Creator) is the character submission system for the Concord LARP. Players build heroes (and Band/Sect groups) in a guided wizard, and reviewers approve them. Built with Next.js 16 (static export), Tailwind CSS v4 and Firebase.

- **Live site:** https://waystone.concordlarp.com/
- **To-do board:** https://github.com/users/SwordSalesman/projects/1
- **Firebase:** [production](https://console.firebase.google.com/project/concordcharactercreator/overview) · dev project `concordcharactercreatordev`

| Page           | Purpose                                                             |
| -------------- | ------------------------------------------------------------------- |
| `/hero`        | Create and submit a hero                                            |
| `/groups`      | Band/Sect submission (built, hidden behind a feature flag)          |
| `/approvals`   | Review submissions, email players, export CSV (Editors/Admins)      |
| `/herb-garden` | Secret cookie-clicker minigame ([notes](src/herb-garden/readme.md)) |

Civil Service members can register to the "Civil Service realm" at `/hero?civilservice=true`.

> Working on this repo with an AI agent? See [AGENTS.md](AGENTS.md) for architecture and conventions.

## Local development

```bash
npm install
cp .env.dev .env     # dev Firebase project (use .env.prod only deliberately)
npm run dev
```

Other commands: `npm run build` (static export to `/out`), `npm run lint`, `npm test`.

### Tests

`npm test` runs the Vitest suite once. Tests live beside the helpers in
`src/utils/*.test.ts` and cover hero rules, form field side effects, and saved-character
conversions. They run in Node without Firebase credentials or a browser.

Use `npm test -- src/utils/form-rules.test.ts` to run one file, or
`npx vitest` for watch mode. UI interactions, Firebase persistence, and Cloud
Functions are not covered by this suite.

### Continuous integration

[GitHub Actions](.github/workflows/ci.yml) runs separate **Lint**, **Tests**, and
**Build** checks on pull requests targeting `production` or `development`, and on
pushes to either branch. Each check uses Node.js 22 and installs dependencies with
`npm ci`. The build uses `.env.dev`; it validates the static export without
deploying it or Cloud Functions.

After the workflow has run, select **Lint**, **Tests**, and **Build** as required
status checks in the GitHub branch ruleset. The workflow reports results; the
ruleset is what blocks merging when they fail.

## Deployment

Cloudflare Pages watches this repo:

- Push to `development` → preview site (auto-generated Cloudflare URL), using the dev Firebase project.
- Push to `production` → https://waystone.concordlarp.com/.

Cloud Functions are deployed separately by hand. See [functions/README.md](functions/README.md).

## Firebase

We use Firebase for authentication and database on the pay-as-you-go **Blaze** plan (small free tier). Besides hosting and the domain, it is the only ongoing cost.

- **Auth:** Google and email/password sign-in. Firebase handles passwords.
- **Firestore:** stores users, characters, approvals and groups. Collections are drafted in [docs/firestore-schema.md](docs/firestore-schema.md).
- **Security rules:** the Firestore API is public by nature (it's called from the browser), so protection comes entirely from security rules. These currently live in the Firebase console only (TODO: move into the repo). They limit access to signed-in users who own the document they touch.
- **Cloud Functions:** approvals and emails, band member lookup, and the herb-garden leaderboard. See [functions/README.md](functions/README.md).

## User roles

Assigned manually in the Firestore console (`users/{uid}.role`).

| Role | Name   | Access                                             |
| ---- | ------ | -------------------------------------------------- |
| 0    | Guest  | Signed out. Nothing                                |
| 1    | Player | View and edit only their own data                  |
| 2    | Viewer | View everything, edit only their own               |
| 3    | Editor | View and edit everything (currently same as Admin) |
| 4    | Admin  | Everything                                         |
