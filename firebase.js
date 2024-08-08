import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAoMaWv-7DyJuPsCHUsqS3git4XKD_rFYg",
  authDomain: "inventory-management-f61f1.firebaseapp.com",
  projectId: "inventory-management-f61f1",
  storageBucket: "inventory-management-f61f1.appspot.com",
  messagingSenderId: "992430410038",
  appId: "1:992430410038:web:20b6ea2de5ede2b8474b97",
  measurementId: "G-1DEJDG9QKY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error(error);
  }
};

const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
  }
};

export { auth, firestore, signInWithGoogle, logOut };

if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    const analytics = getAnalytics(app);
  });
}
