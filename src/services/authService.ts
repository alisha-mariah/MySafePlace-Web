import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/src/lib/firebaseClient";

export async function registerUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = credential.user.uid;
  const displayName = `${firstName} ${lastName}`.trim();

  await updateProfile(credential.user, { displayName });

  await setDoc(doc(db, "users", uid), {
    email,
    firstName,
    lastName,
    displayName,
    createdAt: serverTimestamp(),
    streakCount: 0,
    lastActiveDate: null,
  });

  return credential.user;
}

export async function loginUser(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}
