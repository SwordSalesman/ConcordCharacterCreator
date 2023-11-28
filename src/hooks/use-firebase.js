// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
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
} from "firebase/firestore";
import { getCurrentDate } from "../helpers/date-helper";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

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

const logInWithEmailAndPassword = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        if (err.code === "auth/wrong-password") {
            throw new Error("incorrect password");
        } else {
            throw new Error(err.message);
        }
    }
};

const registerWithEmailAndPassword = async (name, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name,
            authProvider: "email",
            email,
            role: 4,
        });
        return;
    } catch (err) {
        if (err.code === "auth/email-already-in-use") {
            throw new Error("Email already in used");
        } else {
            throw new Error(err.message);
        }
    }
};

const sendPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (err) {
        console.error(err);
    }
};

const logout = async () => {
    await signOut(auth).then();
};

// FIRESTORE PUTTING **************************************************************

const saveUserForm = async (form, setSubmissionDate, name) => {
    const date = getCurrentDate();
    let fullForm = {
        player: name,
        email: auth.currentUser.email,
        ...form,
    };
    fullForm.date = date;
    await setDoc(doc(db, "characters", auth.currentUser.uid), fullForm);
    setSubmissionDate(date);
    return fullForm;
};

const saveApproval = async (name, comment, status, subjectUid) => {
    const date = getCurrentDate();
    let approval = {
        author: name,
        date: date,
        comment: comment,
        status: status,
    };
    await setDoc(doc(db, "approvals", subjectUid), approval);
    return approval;
};

// FIRESTORE GETTING **************************************************************

const getUserForm = async () => {
    const docRef = doc(db, "characters", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null;
    }
};

const getUserFormAndApproval = async () => {
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
    const docRef = doc(db, "approvals", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null;
    }
};

const getApproval = async (uid) => {
    const docRef = doc(db, "approvals", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null;
    }
};

const getCharacterList = async () => {
    const charactersRef = collection(db, "characters");
    const q = query(charactersRef);
    try {
        const querySnap = await getDocs(q);
        let list = [];
        querySnap.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
        });
        return list;
    } catch (err) {
        console.error(err);
    }
};

const getApprovalList = async () => {
    const approvalsRef = collection(db, "approvals");
    const q = query(approvalsRef);
    try {
        const querySnap = await getDocs(q);
        let list = [];
        querySnap.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
        });
        return list;
    } catch (err) {
        console.error(err);
    }
};

export {
    auth,
    db,
    signInWithGoogle,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    saveUserForm,
    getUserForm,
    getUserFormAndApproval,
    getUserDetails,
    getCharacterList,
    saveApproval,
    getApproval,
    getUserApproval,
    getApprovalList,
    logout,
};
