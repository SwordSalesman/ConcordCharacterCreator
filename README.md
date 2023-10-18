# ⚔️ Concord Character Creator ⚔️

## 🚀 Live Site

https://swordsalesman.github.io/ConcordCharacterCreator/

## 🔍 Rowy

https://rowy.app/p/concordcharactercreator

Rowy lets us view (and edit) the data in our database and export it to useful formats like csv.

### 🔑 Access

Access has been granted to a few concord team emails. If you don't already have access, then you probably shouldn't have access. If you're lost, talk to the web team.

## 🔥 Firebase

https://console.firebase.google.com/u/0/project/concordcharactercreator/overview

Firebase is a google product which does a bunch of cool cloud stuff - we're using it for it's authentication and it's database, Firestore. We are using the 'Blaze' payment plan, which is a usage based payment plan with a small free threshold per time period. Other than the web server and the domain, this is the only ongoing cost.

### 🪪 Firebase Auth

Firebase handles all the user authentication for the site - which is great because we don't have to handle passwords and worry about security too much.

### 🗃️ Firestore

Firestore is the cloud database which goes hand in hand with Firebase Auth. We use it to store all the character data. The problem with Firestore is the data is hard to make use of in a conventional excel format without code - which is why we use Rowy.

#### 🔐 Firestore Access

The Firestore API is public by nature of it being used by the front end. The database is protected by security rules set in the Firestore console. These rules restrict access to the database to only (1) logged in users, (2) which own the document they are accessing === malicious actors can't edit/delete documents unless they made the documents.

## Notes

-   Old homepage setting: https://SwordSalesman.github.io/ConcordCharacterCreator
