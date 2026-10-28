# AGENTS.md

Guidance for AI coding agents (and humans) working in this repository. `CLAUDE.md` points here.

## What this is

**Waystone** (formerly the Concord Character Creator) is the character submission tool for the Concord LARP.

- Players build a **hero** in a multi-tab wizard and submit it.
- Players can also submit **groups** (Bands and Sects). Built, but disabled by a feature flag.
- Reviewers (Editors/Admins) approve, deny or archive submissions on `/approvals`, optionally emailing the player.
- `/herb-garden` is a secret, peripheral cookie-clicker minigame. See `src/herb-garden/readme.md`.

Audience for the code and docs: the maintainer, future devs, AI agents. The repo is public, so never commit secrets.

## Commands

```bash
npm run dev      # Dev server (needs a .env, see below)
npm run build    # Static export to /out
npm run lint     # ESLint
npm --prefix functions run build   # Compile Cloud Functions
```

There is no test runner; `npm run lint` and `npm run build` are the only verification.

### Environment

Firebase config comes from `NEXT_PUBLIC_*` vars in `.env`. Copy `.env.dev` (dev Firebase project) or `.env.prod` into `.env`. `NEXT_PUBLIC_DEBUG_TEXT=DevMode` shows dev-only UI. `NEXT_PUBLIC_MAINTENANCE_MODE` shows the maintenance page. `NEXT_PUBLIC_HERB_JUMPSTART=true` gives the herb garden a head start.

## Stack

- Next.js 16 (Pages Router), React 18, TypeScript. `output: "export"` with unoptimized images, so no server runtime and no Next API routes.
- Tailwind CSS v4, `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge). Radix UI + local shadcn-style primitives in `src/components/ui/`. Follow the Button pattern (CVA variants + Tailwind + Radix Slot).
- Firebase Auth + Firestore (client SDK, v9) and Cloud Functions (`functions/`, v2 callables).
- `@/*` maps to `src/*`. Use it for internal imports.

## Hosting and environments

Cloudflare Pages auto-deploys from git:

| Branch        | Result                                         | Firebase project               |
| ------------- | ---------------------------------------------- | ------------------------------ |
| `development` | Preview site, auto-generated Cloudflare URL    | `concordcharactercreatordev`   |
| `production`  | https://waystone.concordlarp.com/              | `concordcharactercreator`      |

Cloud Functions are deployed manually with the Firebase CLI. See [functions/README.md](functions/README.md). `.firebaserc` aliases: `development` (default) and `production`.

`gh-pages` / `predeploy` in `package.json` are legacy. The site is not on GitHub Pages.

## Architecture

### Providers (`src/pages/_app.tsx`)

`UserContextProvider` > `FormContextProvider` > `Header`, `PageMeta`, react-hot-toast `Toaster`. Theme (light/dark) is stored in localStorage and applied as a body class. `GroupContextProvider` is mounted per page in `/groups`.

- **`UserContext`** (`src/context/userContext.tsx`): Firebase auth user, name, `role`, `isAdmin` (`role >= 3`). Use `useUserContext()`.
- **`FormContext`** (`src/context/formContext.tsx`): **the brain of the hero submission tool.** `useReducer` over `FormState`, XP/slot remaining, validity, and cascading rules (skill prerequisites/exclusions, mandatory spells/crafts, pruning invalid options). Loads the user's saved hero and approval on auth change. **Character creation rule changes almost always land here**, together with the tables in `src/data/tables/` and `src/utils/validity-helper.ts`. Respect its reducer side effects rather than duplicating logic inline.
- **`GroupContext`** (`src/context/groupContext.tsx`): `GroupState` for Band/Sect submissions, with archetype-specific detail shapes. Takes `type` (`"Band" | "Sect"`) and optional `startingRealm`, and loads the group from Firestore on mount. Changing `archetype` resets `archetypeDetails`.

### Routes

| Route               | File                           | Notes                                                              |
| ------------------- | ------------------------------ | ------------------------------------------------------------------ |
| `/`                 | `pages/index.tsx`              | Navigation gated by site settings and role                         |
| `/hero`             | `pages/hero/index.tsx`         | `?civilservice=true` unlocks the semi-secret Civil Service realm   |
| `/groups`           | `pages/groups/index.tsx`       | Needs sign-in + submitted hero; gated by `features.groupSubmissions` |
| `/approvals`        | `pages/approvals/index.tsx`    | Editors/Admins (`isAdmin`)                                         |
| `/herb-garden`      | `pages/herb-garden.tsx`        | Minigame; code in `src/herb-garden/`                               |
| `/reset-password`, `/maintenance`, `404` | `pages/`  |                                                                    |

Route/status constants: `src/utils/constants.ts`.

### Hero wizard

`src/components/creator/Creator.tsx` is the shared 6-tab shell: Intro, Realm, Skills, Options, Background, Review. `src/components/characterCreator/CharacterCreator.tsx` wires it up and tab content lives in `characterCreator/tabs/`. Review submits via `saveUserForm()`.

### Groups

`src/components/groupCreator/` (`BandCreator`, `SectCreator`, `bandTabs/`, `sectTabs/`). The group management page is used by the group owner. A groups approvals page (Editors) does not exist yet.

### Approvals

`src/components/approvals/`. Reviews go through the `submitApproval` Cloud Function, never directly from the browser. Character lists can be exported to CSV from this page.

## Firebase

- All client calls are in `src/hooks/use-firebase.ts`: auth (Google, email/password, reset), character/approval/group reads and writes, and callable function wrappers.
- Collections and document shapes are drafted in [docs/firestore-schema.md](docs/firestore-schema.md). **There is no enforced schema.** Check and update that file when changing stored data.
- **Firestore security rules currently live only in the Firebase web console**, not in this repo. TODO: export to `firestore.rules` and add to `firebase.json`. Treat any change to data access patterns as needing a matching console rule change.
- Cloud Functions (`functions/src/index.ts`):
  - `submitApproval`: reviewer (role >= 3) writes an approval, clears the character's `changes`, and optionally sends a Gmail email.
  - `getBandMembers`: returns `{ id, player, heroName }` for heroes whose `warband` matches the band. Callable by the band owner or role >= 3.
  - `claimThrone`: herb-garden win. Any signed-in user can call it. It maintains the leaderboard.

## Roles

Assigned manually in the Firestore console on `users/{uid}.role`. New email sign-ups get `1`.

| Value | Role                    | Notes                                              |
| ----- | ----------------------- | -------------------------------------------------- |
| 0     | Guest (unauthenticated) |                                                    |
| 1     | Player                  | Own data only                                      |
| 2     | Viewer                  |                                                    |
| 3     | Editor                  | Treated as Admin for all current purposes          |
| 4     | Admin                   | `isAdmin` is `role >= 3`, so Editor passes it too  |

## Game data

Static, hand-edited TypeScript in `src/data/tables/` (skills, realms, spells, crafts, ceremonies, potions, archetypes, band archetypes, regions, investments...), bundled at build time and never fetched. Rule changes are rare and manual. Lookup helpers are in `src/utils/data-helper.tsx`. Past data migrations: `src/utils/migration-helper.ts`, `src/data/logs/`.

## Feature flags

`src/utils/settings.ts` (`getSiteSettings()`): `pages.*` toggles pages, `features.groupSubmissions` is **false** (Groups not live yet).

## Conventions

- Keep changes scoped; avoid broad refactors unless asked.
- Tailwind only. Shared class strings are in `src/styles/Global.ts`.
- Put logic in existing helper layers (`src/utils/`) instead of inline transformations.
- When touching submission or approval code, re-check auth guards and role gating.
- Static export: no `next/image` optimization, no server-side Next features.
- Never put secrets in `NEXT_PUBLIC_*` vars or commit them. Gmail credentials are Firebase secrets only.
- Characters are stored in a flat "summary" format (arrays as comma-separated strings). `src/utils/character-to-form-state.ts` converts back to `FormState`.

## Known cruft / TODOs

- `@headlessui/react` and `react-router-dom` are in `package.json` but appear unused in `src/`. `next.config.ts` still references `@chakra-ui/react` in `optimizePackageImports`.
- `dist/output.css` is tracked in git, and `src/components/downtime/` is empty (downtime is not built).
- TODO: Firestore rules in code, an enforced schema, a package script to switch `.env.dev` / `.env.prod`.
