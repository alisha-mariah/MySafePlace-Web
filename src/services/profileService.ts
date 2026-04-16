import {
  updateProfile,
  updatePassword,
  verifyBeforeUpdateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  User,
} from "firebase/auth";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/src/lib/firebaseClient";

/**
 * Re-authenticate the user with their current password.
 * Required before email change, password change, or account deletion.
 */
export async function reauthenticate(user: User, currentPassword: string): Promise<void> {
  if (!user.email) throw new Error("No email on account.");
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
}

/**
 * Update the user's display name in Firebase Auth + Firestore.
 */
export async function updateDisplayName(user: User, displayName: string): Promise<void> {
  await updateProfile(user, { displayName });
  const parts = displayName.trim().split(" ");
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";
  await updateDoc(doc(db, "users", user.uid), { displayName, firstName, lastName });
}

/**
 * Send a verification email to the new address.
 * The email change only takes effect after the user clicks the verification link.
 */
export async function updateUserEmail(user: User, newEmail: string): Promise<void> {
  await verifyBeforeUpdateEmail(user, newEmail);
}

/**
 * Change the user's password.
 */
export async function changeUserPassword(user: User, newPassword: string): Promise<void> {
  await updatePassword(user, newPassword);
}

/**
 * Delete the user's Firestore document and Firebase Auth account.
 */
export async function deleteUserAccount(user: User): Promise<void> {
  try { await deleteDoc(doc(db, "users", user.uid)); } catch { /* doc may not exist */ }
  await deleteUser(user);
}
