import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/src/lib/firebaseClient";

// ── Types ──────────────────────────────────────────────
export interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION = "journalEntries";

// ── Create ─────────────────────────────────────────────
export async function addJournalEntry(
  userId: string,
  content: string
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    userId,
    content,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// ── Read (for one user, newest first) ──────────────────
export async function getJournalEntries(userId: string): Promise<JournalEntry[]> {
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);

  const entries = snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      userId: data.userId,
      content: data.content ?? "",
      createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? new Date(),
    };
  });

  return entries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// ── Update ─────────────────────────────────────────────
export async function updateJournalEntry(
  entryId: string,
  content: string
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, entryId), {
    content,
    updatedAt: serverTimestamp(),
  });
}

// ── Delete ─────────────────────────────────────────────
export async function deleteJournalEntry(entryId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, entryId));
}
