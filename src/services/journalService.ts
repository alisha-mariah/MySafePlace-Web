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
  moodLabel?: string;
  moodColor?: string;
}

export interface JournalMoodData {
  moodLabel: string;
  moodColor: string;
}

const COLLECTION = "journalEntries";

// ── Create ─────────────────────────────────────────────
export async function addJournalEntry(
  userId: string,
  content: string,
  mood?: JournalMoodData
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    userId,
    content,
    ...(mood ? { moodLabel: mood.moodLabel, moodColor: mood.moodColor } : {}),
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
      moodLabel: data.moodLabel ?? undefined,
      moodColor: data.moodColor ?? undefined,
    };
  });

  return entries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// ── Update ─────────────────────────────────────────────
export async function updateJournalEntry(
  entryId: string,
  content: string,
  mood?: JournalMoodData | null
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, entryId), {
    content,
    // null clears the mood; undefined means "don't touch it"
    ...(mood === null
      ? { moodLabel: null, moodColor: null }
      : mood
      ? { moodLabel: mood.moodLabel, moodColor: mood.moodColor }
      : {}),
    updatedAt: serverTimestamp(),
  });
}

// ── Delete ─────────────────────────────────────────────
export async function deleteJournalEntry(entryId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, entryId));
}
