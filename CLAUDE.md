# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build (outputs to /build)
npm run start    # Start production server
npm run lint     # Run ESLint
```

There are no test commands configured.

## Architecture

This is a **Next.js 15 / TypeScript** app (Pages Router) for a LARP character submission system. Players fill out a multi-tab form to create characters; admins review and approve submissions. The site is deployed to GitHub Pages.

### State Management

Three React contexts are used across the app (wrapped in `src/pages/_app.tsx`):

- **`UserContext`** (`src/context/userContext.tsx`) — Firebase auth state: current user, their name, and their role (0–4, where 4 = Admin). Access via `useUserContext()`.
- **`FormContext`** (`src/context/formContext.tsx`) — All character creation form state via `useReducer`. Holds the full `FormState` object (realm, skills, background text, etc.), XP/slot remaining calculations, and validation. Access via `useFormContext()`. On mount, auto-loads the user's saved form from Firestore.
- **`GroupContext`** (`src/context/groupContext.tsx`) — Form state for player group submissions (Bands and Sects) via `useReducer`. Holds `GroupState` (type, realm, name, archetype, archetypeDetails, visuals, history, oath, goals) plus an `approval` record. `GroupContextProvider` takes a `type` (`"Band" | "Sect"`) and optional `startingRealm` prop, and auto-loads the group from Firestore via `getGroup()` on mount. Access the context via `GroupContext` directly. Archetype-specific detail shapes (e.g. `GuilderDetails`, `ClanDetails`, `KnightlyOrderDetails`) are exported from this file.

### Character Creator Flow

`src/components/creator/Creator.tsx` is the main shell — a 6-tab wizard:

1. **Intro** → **Realm** → **Skills** → **Options** → **Background** → **Review**

Tab content lives in `src/components/creator/tabs/`. Navigation (prev/next) and submission happen in `Creator.tsx`. The Review page calls `saveUserForm()` from `src/hooks/use-firebase.ts` to persist to Firestore.

### Firebase Integration

All Firebase calls go through `src/hooks/use-firebase.ts`. Key operations:

- `getUserFormAndApproval()` — fetches the user's saved character + approval record
- `saveUserForm()` — writes the character form to Firestore
- Auth: Google sign-in and email/password, wrapped in `userContext.tsx`

### Game Data

Static game data (skills, realms, archetypes, crafts, etc.) lives in `src/data/tables/` as TypeScript files. Lookup helpers are in `src/utils/data-helper.tsx`. This data is never fetched — it's bundled at build time.

### Styling Approach

The codebase uses **Tailwind CSS v4** exclusively. Utility classes + `cn()` from `src/lib/utils.ts` (wraps `clsx` + `tailwind-merge`). styled-components has been fully removed.

Shared Tailwind class strings (e.g. fade-strip, grid-mirror helpers) live in `src/styles/Global.ts` as exported constants.

UI primitives come from **Radix UI** (dialog, navigation menu) and a local **Shadcn/UI** setup (`src/components/ui/`). New components should follow the Button pattern: CVA variants + Tailwind + Radix Slot where needed.

### Path Aliases

`@/*` maps to `src/*` — use this for all internal imports.

### Feature Flags

`src/utils/settings.ts` contains site-wide toggles (e.g., whether group/downtime submission is open). The home page (`src/pages/index.tsx`) gates navigation buttons behind these settings and user role checks.

### User Roles

| Value | Role                    |
| ----- | ----------------------- |
| 0     | Guest (unauthenticated) |
| 1     | Player                  |
| 2     | Viewer                  |
| 3     | Editor                  |
| 4     | Admin                   |

Role is stored in Firestore on the user record and read into `UserContext`.
