# ⚔️ Waystone ⚔️

(formerly the Concord Character Creator)

## Completed Work

##### Approvals

- Ability to remove hero submissions in approvals window. Delete/Archive button.
- Fix the full stop paragraph thing in approvals

##### Creator

- Transition animations for accordions
- When a player submits a character after they've been approved, their approval still reads 'approved'. This is treated as 'pending' by the approval window, need to make sure this is reflected in the exported sheet. This is fixed.

##### Technical

- Port from create-react-app to next.js
- Migrate from styled components to tailwind

## To Do list

- Further options for characters. Bordervar common/noble/knight options.
- Mastered Ceremonies should be managed by the church team, not the character creator
    - Fix the divine lore per sphere giving known ceremonies thing, you know the one.
- Test firebase rules for new document types (groups, groupApprovals, public)
- Improve the diffs on the admin approvals window: https://www.npmjs.com/package/fast-diff
    - Could save a whole copy of the hero submission under "HeroesApproved" instead of "Heroes", which is only updated when a Hero gets approved. Comparisons become a lot easier, direct 1:1
- Automatic confirmation emails when a player submits their character
- Make the alert banner adjustable without a deploy, make it read from firebase probably.
- Brainstorm ways to submit player groups and integrate into character submission, then build the whole thing
    - New submission widget for groups, just like the character creator
    - Approvals window for groups also
    - When a group is approved, it will appear in the list of groups that players can select from a dropdown
- 'Epithets' and 'True Name' fields. Name (Your hero's public name without following titles, may be published in Winds of the Worlds). Epithets - optional (Titles or monikers. E.g. the quoted text is all ephithets: Sir Dennis Braggard "Last of His Name, Feller of Beasts"). True Name - optional (If your public name is a fake, put your real one here. This won't be published in Winds of the World unless there's a good reason.)

## 🚀 Live Site

https://charactercreator.concordlarp.com/

## 🔥 Firebase

https://console.firebase.google.com/project/concordcharactercreator/overview

There is also a dev project which is very helpful for testing: **concordcharactercreatordev**

Firebase is a google product which does a bunch of cool cloud stuff - we're using it for it's authentication and it's database, Firestore. We are using the 'Blaze' payment plan, which is a usage based payment plan with a small free threshold per time period. Other than the web server and the domain, this is the only ongoing cost.

### 🪪 Firebase Auth

Firebase handles all the user authentication for the site - which is great because we don't have to handle passwords and worry about security too much.

### 🗃️ Firestore

Firestore is the cloud database which goes hand in hand with Firebase Auth. We use it to store all the character data. Character data can be exported to CSV using the export button in the approvals window.

#### 🔐 Firestore Access

The Firestore API is public by nature of it being used by the front end. The database is protected by security rules set in the Firestore console. These rules restrict access to the database to only (1) logged in users, (2) which own the document they are accessing === malicious actors can't edit/delete documents unless they made the documents.

### ✉️ Approval Emails

The approval screen calls the `submitApproval` Firebase Callable Function rather than writing approvals directly from the browser. The function verifies the signed-in reviewer's role, reads the character and recipient address from Firestore, writes the approval, clears the character's `changes` value, then sends the review email through the Gmail API.

The approval is written before the email is sent. Each approval records `email.status` as `pending`, `sent`, or `failed`, so a Gmail failure does not lose the review. The Gmail message is sent by the shared mailbox that authorized the OAuth application.

The Cloudflare-hosted frontend never receives Gmail credentials. The function reads these Firebase Secret Manager secrets only while it runs:

```text
GMAIL_CLIENT_ID
GMAIL_CLIENT_SECRET
GMAIL_REFRESH_TOKEN
```

These secrets are separate for the production and development Firebase projects. Do not commit their values, add them to frontend environment variables, or use a `NEXT_PUBLIC_` name for them.

#### Function Development And Deployment

The `functions/` directory is source-controlled with the frontend. Build the function locally before deployment:

```sh
npm --prefix functions run build
```

Deploy to the development Firebase project first. It is the default project and is also named by the explicit `development` alias:

```sh
npx -y firebase-tools@latest deploy --only functions --project development
```

After testing with development data and a safe test recipient, deploy the same source to production:

```sh
npx -y firebase-tools@latest deploy --only functions --project production
```

Set or rotate each Gmail secret for the project being deployed. The Firebase CLI prompts for the value and stores it in Google Cloud Secret Manager:

```sh
npx -y firebase-tools@latest functions:secrets:set GMAIL_CLIENT_ID --project development
npx -y firebase-tools@latest functions:secrets:set GMAIL_CLIENT_SECRET --project development
npx -y firebase-tools@latest functions:secrets:set GMAIL_REFRESH_TOKEN --project development
```

Use `--project production` instead when configuring production secrets. Deploy the function again after adding or changing a secret so the deployed function receives the updated secret version.

## Notes

User Authorisation levels:

4. Admin (Can view everything, can edit everything)
5. Editor (Can view everything, can edit select things)
6. Viewer (Can view everything, can edit only their things)
7. Player (Can view and edit only their own things)
8. Guest (Can't do anything)
