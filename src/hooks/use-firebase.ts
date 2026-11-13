// Import the functions you need from the SDKs you need
import { FirebaseError } from "firebase/app";
import { initializeApp } from "firebase/app";
import {
	GoogleAuthProvider,
	getAuth,
	signInWithPopup,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	confirmPasswordReset,
	signOut,
	deleteUser,
} from "firebase/auth";
import {
	getFirestore,
	query,
	getDocs,
	collection,
	where,
	getDoc,
	doc,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getCurrentDate } from "../utils/date-helper";
import { GroupType } from "@/context/groupContext";
import type { Character, ApprovalRecord } from "@/components/approvals/types";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

function getErrorCode(error: unknown): string | undefined {
	return error instanceof FirebaseError ? error.code : undefined;
}

function getErrorMessage(error: unknown): string {
	return error instanceof Error ? error.message : String(error);
}

// FIREBASE AUTH **************************************************************

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
	try {
		const res = await signInWithPopup(auth, googleProvider);
		const user = res.user;
		const q = query(collection(db, "users"), where("uid", "==", user.uid));
		const docs = await getDocs(q);
		if (docs.docs.length === 0) {
			await setDoc(doc(db, "users", user.uid), {
				uid: user.uid,
				name: user.displayName,
				authProvider: "google",
				email: user.email,
			});
		}
	} catch (err) {
		console.error(err);
	}
};

const logInWithEmailAndPassword = async (email: string, password: string) => {
	try {
		await signInWithEmailAndPassword(auth, email, password);
	} catch (err: unknown) {
		if (getErrorCode(err) === "auth/wrong-password") {
			throw new Error("incorrect password");
		} else {
			throw new Error(getErrorMessage(err));
		}
	}
};

const registerWithEmailAndPassword = async (name: string, email: string, password: string) => {
	let res;
	try {
		res = await createUserWithEmailAndPassword(auth, email, password);
	} catch (err: unknown) {
		if (getErrorCode(err) === "auth/email-already-in-use") {
			throw new Error("Email already in use");
		} else {
			throw new Error(getErrorMessage(err));
		}
	}
	try {
		const user = res.user;
		await setDoc(doc(db, "users", user.uid), {
			uid: user.uid,
			name,
			authProvider: "email",
			email,
			role: 1,
		});
		return;
	} catch (err: unknown) {
		// Delete the auth user in the case that the doc rules were violated but the auth ones weren't
		await deleteUser(res.user);
		if (getErrorCode(err) === "auth/email-already-in-use") {
			throw new Error("Email already in used");
		} else {
			throw new Error(getErrorMessage(err));
		}
	}
};

const sendPasswordReset = async (email: string) => {
	try {
		await sendPasswordResetEmail(auth, email);
	} catch (err) {
		console.error(err);
	}
};

// Confirms via oobCode on explicit user submit only; never auto-verify on page
// load, since email security scanners prefetch links and burn the one-time code.
const resetPasswordWithCode = async (oobCode: string, newPassword: string) => {
	await confirmPasswordReset(auth, oobCode, newPassword);
};

const logout = async () => {
	await signOut(auth).then();
};

// FIRESTORE PUTTING **************************************************************

const saveUserForm = async (
	form: Record<string, unknown>,
	setSubmissionDate: (date: string) => void,
	name: string,
) => {
	const date = getCurrentDate();
	if (!auth.currentUser) throw new Error("No authenticated user");
	const fullForm = {
		player: name,
		email: auth.currentUser.email,
		...form,
		date: date,
	};
	await setDoc(doc(db, "characters", auth.currentUser.uid), fullForm);
	setSubmissionDate(date);
	return fullForm;
};

const APPROVAL_STATUSES = ["Approved", "Denied", "Archived"] as const;
type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];
type EmailStatus = "pending" | "sent" | "not sent" | "failed";

interface Approval {
	author: string;
	date: string;
	comment: string;
	status: ApprovalStatus;
	email: {
		status: EmailStatus;
		sentAt: string;
		failedAt: string;
		gmailMessageId: string | null;
	};
}

const saveApproval = async ({
	name,
	comment,
	status,
	subjectUid,
	sendEmail,
}: {
	name: string;
	comment: string;
	status: ApprovalStatus;
	subjectUid: string;
	sendEmail: boolean;
}) => {
	const submitApproval = httpsCallable<
		{ subjectUid: string; status: ApprovalStatus; comment: string; sendEmail: boolean },
		{ approval: Approval }
	>(functions, "submitApproval");
	const result = await submitApproval({ subjectUid, status, comment, sendEmail });
	return result.data;
};

const saveGroup = async ({ group, type }: { group: object; type: GroupType }) => {
	if (!auth.currentUser) throw new Error("No authenticated user");
	const date = getCurrentDate();

	await setDoc(doc(db, type === "Band" ? "bands" : "sects", auth.currentUser.uid), {
		...group,
		date: date,
	});
	return;
};

const saveGroupApproval = async ({
	approval,
	type,
	subjectUid,
}: {
	approval: Record<string, unknown>;
	type: GroupType;
	subjectUid: string;
}) => {
	if (!auth.currentUser) throw new Error("No authenticated user");
	const date = getCurrentDate();

	await setDoc(doc(db, type === "Band" ? "bandApprovals" : "sectApprovals", subjectUid), {
		...approval,
		date: date,
	});
	return;
};

type GroupListEntryType = {
	name: string;
	realm: string;
};

type GroupListType = {
	bands: GroupListEntryType[];
	sects: GroupListEntryType[];
};

const saveGroupList = async ({ list }: { list: GroupListType }) => {
	if (!auth.currentUser) throw new Error("No authenticated user");
	const date = getCurrentDate();

	await setDoc(doc(db, "public", "groupList"), {
		...list,
		date: date,
	});
	return;
};

// Used in admin commands to update users without updating their submission date
const migrateUser = async (userId: string, form: Record<string, unknown>) => {
	await setDoc(doc(db, "characters", userId), form);
	return form;
};

// FIRESTORE GETTING **************************************************************

export interface ThroneLeaderboardEntry {
	uid: string;
	displayName: string;
	timeMs: number;
	achievedAt: string;
}

export interface ClaimThroneResult {
	rank: number;
	top10: ThroneLeaderboardEntry[];
}

const claimThrone = async (timeMs: number) => {
	if (!auth.currentUser) throw new Error("No authenticated user");
	const submitClaim = httpsCallable<{ timeMs: number }, ClaimThroneResult>(
		functions,
		"claimThrone",
	);
	const result = await submitClaim({ timeMs });
	return result.data;
};

const getUserForm = async () => {
	if (!auth.currentUser) throw new Error("No authenticated user");
	const docRef = doc(db, "characters", auth.currentUser.uid);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		return docSnap.data();
	} else {
		return null;
	}
};

const getUserFormAndApproval = async () => {
	if (!auth.currentUser) throw new Error("No authenticated user");
	const formRef = doc(db, "characters", auth.currentUser.uid);
	const apprRef = doc(db, "approvals", auth.currentUser.uid);
	const formSnap = await getDoc(formRef);
	const apprSnap = await getDoc(apprRef);
	if (formSnap.exists()) {
		const form = formSnap.data();
		if (apprSnap.exists()) {
			const appr = apprSnap.data();
			return { ...form, approval: appr };
		}
		return { ...form, approval: null };
	} else {
		return null;
	}
};

const getUserDetails = async () => {
	if (!auth.currentUser) throw new Error("No authenticated user");
	const docRef = doc(db, "users", auth.currentUser.uid);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		const details = {
			name: docSnap.data().name,
			role: docSnap.data().role,
			uid: docSnap.data().uid,
		};
		return details;
	} else {
		return null;
	}
};

const getUserApproval = async () => {
	if (!auth.currentUser) throw new Error("No authenticated user");
	const docRef = doc(db, "approvals", auth.currentUser.uid);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		return docSnap.data();
	} else {
		return null;
	}
};

const getApproval = async (uid: string) => {
	const docRef = doc(db, "approvals", uid);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		return docSnap.data();
	} else {
		return null;
	}
};

const getGroupSubmissionMessage = async () => {
	const docRef = doc(db, "public", "groupSubmissionMessage");
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		const data = docSnap.data();
		return {
			body: data.body,
			buttonLink: data.buttonLink,
			buttonText: data.buttonText,
		};
	} else {
		return null;
	}
};

const getGroup = async ({ type }: { type: GroupType }) => {
	if (!auth.currentUser) throw new Error("No authenticated user");
	const docRef = doc(db, type === "Band" ? "bands" : "sects", auth.currentUser.uid);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		return docSnap.data();
	} else {
		return null;
	}
};

const getGroupApproval = async ({ type }: { type: GroupType }) => {
	if (!auth.currentUser) throw new Error("No authenticated user");
	const docRef = doc(
		db,
		type === "Band" ? "bandApprovals" : "sectApprovals",
		auth.currentUser.uid,
	);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		return docSnap.data();
	} else {
		return null;
	}
};

const getGroupList = async () => {
	const docRef = doc(db, "public", "groupList");
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		return docSnap.data();
	} else {
		return null;
	}
};

const getThroneLeaderboard = async (): Promise<ThroneLeaderboardEntry[]> => {
	const docRef = doc(db, "public", "herbGardenTop10");
	const docSnap = await getDoc(docRef);
	const entries = docSnap.exists() ? docSnap.data().entries : null;
	return Array.isArray(entries) ? (entries as ThroneLeaderboardEntry[]) : [];
};

const getCharacterList = async (): Promise<Character[]> => {
	const charactersRef = collection(db, "characters");
	const q = query(charactersRef);
	try {
		const querySnap = await getDocs(q);
		const list: Character[] = [];
		querySnap.forEach((doc) => {
			list.push({ ...doc.data(), id: doc.id } as Character);
		});
		return list;
	} catch (err) {
		console.error(err);
		return [];
	}
};

const getApprovalList = async (): Promise<ApprovalRecord[]> => {
	const approvalsRef = collection(db, "approvals");
	const q = query(approvalsRef);
	try {
		const querySnap = await getDocs(q);
		const list: ApprovalRecord[] = [];
		querySnap.forEach((doc) => {
			list.push({ ...doc.data(), id: doc.id } as ApprovalRecord);
		});
		return list;
	} catch (err) {
		console.error(err);
		return [];
	}
};

const getBandMembers = async (bandId?: string) => {
	if (!auth.currentUser) throw new Error("No authenticated user");
	const authId = auth.currentUser.uid;
	const getMembers = httpsCallable<
		{ bandId: string },
		{ id: string; player: string; heroName: string }[]
	>(functions, "getBandMembers");
	const result = await getMembers({ bandId: bandId ?? authId });
	return result.data;
};

export {
	auth,
	db,
	signInWithGoogle,
	logInWithEmailAndPassword,
	registerWithEmailAndPassword,
	sendPasswordReset,
	resetPasswordWithCode,
	saveUserForm,
	getUserForm,
	migrateUser,
	getUserFormAndApproval,
	getUserDetails,
	getCharacterList,
	getGroupSubmissionMessage,
	saveApproval,
	saveGroup,
	saveGroupList,
	getApproval,
	getGroup,
	getUserApproval,
	getApprovalList,
	getGroupList,
	claimThrone,
	getThroneLeaderboard,
	getBandMembers,
	logout,
};
