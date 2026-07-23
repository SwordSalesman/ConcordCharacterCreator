# COPILOT.md

This file is a working reference for GitHub Copilot (GPT-5.3-Codex) when editing this repository.

## Quick Commands

```bash
npm run dev      # Start development server
npm run build    # Production build (static export)
npm run start    # Start production server
npm run lint     # Run ESLint
```

Notes:

- There are no dedicated test scripts configured in package.json.
- Build uses Next static export via next.config.ts.

## Tech Stack and Runtime Model

- Framework: Next.js 16 (Pages Router), TypeScript, React 18
- Styling: Tailwind CSS v4 + tailwind-merge + clsx helper (`cn`)
- Auth + DB: Firebase Auth + Firestore (client-side SDK)
- UI libraries in use: Radix UI primitives, local shadcn-style components, plus some legacy MUI/headless dependencies
- Deployment mode: static export (`output: "export"`) with unoptimized Next images for static hosting

## App Shell and Context Providers

Global app wrapper is in src/pages/\_app.tsx:

- UserContextProvider
- FormContextProvider
- Header
- PageMeta
- react-hot-toast Toaster

Theme mode is persisted in localStorage ("light"/"dark") and applied to body class.
Maintenance mode is gated by NEXT_PUBLIC_MAINTENANCE_MODE.

## Primary User Flows

### Home

- Route: src/pages/index.tsx
- Entry navigation to:
    - Hero submission (`/hero`)
    - Group submission (`/groups`) when enabled by site settings
    - Admin approvals (`/approvals`) for admin users

### Hero Submission

- Route: src/pages/hero/index.tsx
- Main component: src/components/characterCreator/CharacterCreator.tsx
- Shared wizard shell: src/components/creator/Creator.tsx
- Tabs order:
    1. Intro
    2. Realm
    3. Skills
    4. Options
    5. Background
    6. Review
- Submission call: saveUserForm() from src/hooks/use-firebase.ts

### Group Submission

- Route: src/pages/groups/index.tsx
- Uses GroupContextProvider with type "Band" or "Sect"
- Main builders:
    - src/components/groupCreator/BandCreator.tsx
    - src/components/groupCreator/SectCreator.tsx
- Feature gate: getSiteSettings().features.groupSubmissions
- Requires signed-in user and submitted hero date before access

### Admin Approvals

- Route: src/pages/approvals/index.tsx
- Main component: src/components/approvals/Approvals.tsx
- Access gated by isAdmin from UserContext

## State Management

### User Context

- File: src/context/userContext.tsx
- Source of truth for:
    - authenticated user
    - user display name
    - role
    - isAdmin (role >= 3 in current implementation)
- Uses react-firebase-hooks auth state + getUserDetails()

### Form Context (Hero)

- File: src/context/formContext.tsx
- useReducer-powered hero form state and side-effect rules
- Handles:
    - summary <-> in-memory form transformations
    - validity checks
    - remaining XP/slots
    - cascading rules (skill prereqs/exclusions, mandatory spell/craft items, option pruning)
- Loads existing user form + approval on auth change

### Group Context

- File: src/context/groupContext.tsx
- useReducer-powered state for Band/Sect submission
- Handles archetype and archetypeDetails reset behavior
- Loads existing group submission for authenticated user

## Firebase Integration Surface

All calls are centralized in src/hooks/use-firebase.ts.

Key auth methods:

- signInWithGoogle
- logInWithEmailAndPassword
- registerWithEmailAndPassword
- sendPasswordReset
- logout

Key Firestore methods:

- saveUserForm
- getUserForm / getUserFormAndApproval
- saveApproval / getApproval / getApprovalList
- saveGroup / getGroup / getGroupApproval
- saveGroupList / getGroupList
- getCharacterList
- migrateUser

## Data and Rules Sources

- Static game data tables: src/data/tables/
- Data lookup helpers: src/utils/data-helper.tsx
- Validation helpers: src/utils/validity-helper.ts
- Feature flags: src/utils/settings.ts
- Route constants/status constants: src/utils/constants.ts

## Styling and UI Conventions

- Tailwind utility classes are the default styling approach.
- Shared class-string helpers live in src/styles/Global.ts.
- Use cn() from src/lib/utils.ts to merge conditional classes.
- For common controls, prefer existing primitives in src/components/common/ and src/components/ui/.

## Path Alias

- `@/*` -> `src/*` (configured in tsconfig.json)
- Prefer alias imports for internal modules.

## Operational Notes for Edits

- Keep changes scoped and avoid broad refactors unless requested.
- Respect existing reducer-driven side effects in form/group contexts.
- Prefer adding logic in existing helper layers instead of duplicating inline transformations.
- If touching submission or approval logic, sanity-check role gating and required auth guards.
- If touching Next image usage, remember static export constraints.

## Known Project Reality Checks

- CLAUDE.md says Next.js 15; package.json is currently Next.js 16.x.
- Group submissions are currently feature-gated off in site settings by default.
- No test runner command exists yet; lint is the only built-in verification command.
