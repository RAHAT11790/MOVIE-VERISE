import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push, set, remove, update, query, orderByChild, equalTo, get, runTransaction } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, confirmPasswordReset, updatePassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD4XYsXNjpYzebEr3u5tclYZ6bhmVbkIyg",
  authDomain: "advance-movie-app.firebaseapp.com",
  databaseURL: "https://advance-movie-app-default-rtdb.firebaseio.com",
  projectId: "advance-movie-app",
  storageBucket: "advance-movie-app.firebasestorage.app",
  messagingSenderId: "83278715336",
  appId: "1:83278715336:web:37494bb636036edb2248fd"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { ref, onValue, push, set, remove, update, query, orderByChild, equalTo, get, runTransaction, signInWithEmailAndPassword, signOut, signInWithPopup, sendPasswordResetEmail, confirmPasswordReset, updatePassword };
