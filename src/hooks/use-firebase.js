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
    sendEmailVerification,
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

const REACT_APP_FIREBASE_API_KEY = "AIzaSyAyKdRlod7Y0o1c1Yi8IUCxX5BZFYUpSmo";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: REACT_APP_FIREBASE_API_KEY,
    authDomain: "concordcharactercreator.firebaseapp.com",
    projectId: "concordcharactercreator",
    storageBucket: "concordcharactercreator.appspot.com",
    messagingSenderId: "484164261481",
    appId: "1:484164261481:web:aab00c456e1af74596f4f8",
    measurementId: "G-ERSKW9DCL8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

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
        // alert(err.message);
    }
};

const logInWithEmailAndPassword = async (email, password) => {
    // try {
    await signInWithEmailAndPassword(auth, email, password);
    // const user = userCred.user;

    // } catch (err) {
    // console.error(err);
    // alert(err.message);
    // }
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
        });
        await sendEmailVerification(user);
    } catch (err) {
        console.error(err);
        // alert(err.message);
    }
};

const sendPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset link sent!");
    } catch (err) {
        console.error(err);
        // alert(err.message);
    }
};

const saveUserForm = async (form, setSubmissionDate) => {
    const name = await getUserName();
    const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    let fullForm = {
        player: name,
        email: auth.currentUser.email,
        date: date,
    };
    Object.assign(fullForm, form);
    console.log(fullForm);
    await setDoc(doc(db, "characters", auth.currentUser.uid), fullForm);
    setSubmissionDate(date);
    return fullForm;
};

const getUserForm = async (email) => {
    const docRef = doc(db, "characters", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null;
    }
    // const charRef = collection(db, "characters");
    // const q = query(charRef, where("userId", "==", auth.currentUser.uid));
    // const querySnapshot = await getDocs(q);
    // if (querySnapshot.length !== 1) {
    //   return null;
    // } else {
    //   querySnapshot.forEach((doc) => {
    //     return doc.data();
    //   });
    // }
};

const getUserName = async () => {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data().name;
    } else {
        return null;
    }
};

const logout = async () => {
    await signOut(auth).then();
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
    getUserName,
    logout,
};
