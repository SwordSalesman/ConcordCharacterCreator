# ⚔️ Waystone ⚔️

(formerly the Concord Character Creator)

## Completed Work

##### Approvals

- Ability to remove hero submissions in approvals window. Delete/Archive button.
- Fix the full stop paragraph thing in approvals

##### Creator

- Transition animations for accordions

##### Technical

- Port from create-react-app to next.js
- Migrate from styled components to tailwind

## To Do list

- Test firebase rules for new document types (groups, groupApprovals, public)
- Get rid of the current account/theme button and replace with a cog 'settings' button. It spawns a modal which has all the options you need on it.
    - Will
- Fix the divine lore per sphere giving known ceremonies thing, you know the one.
- When a player submits a character after they've been approved, their approval still reads 'approved'. This is treated as 'pending' by the approval window, need to make sure this is reflected in the exported sheet.
- Improve the diffs on the admin approvals window: https://www.npmjs.com/package/fast-diff
- EMAILS (requires a whole rebuild fml)
    - automatic confirmation emails when a player submits their character
    - optional automatic email when a character is approved/denied/generally reviewed
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

## Notes

User Authorisation levels:

4. Admin (Can view everything, can edit everything)
5. Editor (Can view everything, can edit select things)
6. Viewer (Can view everything, can edit only their things)
7. Player (Can view and edit only their own things)
8. Guest (Can't do anything)
