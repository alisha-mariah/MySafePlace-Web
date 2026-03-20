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
export interface MoodEntry {
  id: string;
  userId: string;
  mood: string;
  note: string;
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION = "moodEntries";

// ── Create ─────────────────────────────────────────────
export async function addMoodEntry(
  userId: string,
  mood: string,
  note: string
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    userId,
    mood,
    note,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// ── Read (for one user, newest first) ──────────────────
export async function getMoodEntries(userId: string): Promise<MoodEntry[]> {
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
      mood: data.mood,
      note: data.note || "",
      createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? new Date(),
    };
  });

  return entries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// ── Update ─────────────────────────────────────────────
export async function updateMoodEntry(
  entryId: string,
  mood: string,
  note: string
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, entryId), {
    mood,
    note,
    updatedAt: serverTimestamp(),
  });
}

// ── Delete ─────────────────────────────────────────────
export async function deleteMoodEntry(entryId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, entryId));
}
