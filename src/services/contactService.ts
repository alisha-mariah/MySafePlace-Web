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

export interface PersonalContact {
  id: string;
  userId: string;
  name: string;
  phone: string;
  relationship: string;
  createdAt: Date;
}

const COLLECTION = "personalContacts";

export async function addContact(
  userId: string,
  name: string,
  phone: string,
  relationship: string
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    userId,
    name,
    phone,
    relationship,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getContacts(userId: string): Promise<PersonalContact[]> {
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  const contacts = snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      userId: data.userId,
      name: data.name ?? "",
      phone: data.phone ?? "",
      relationship: data.relationship ?? "",
      createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
    };
  });
  return contacts.sort((a, b) => a.name.localeCompare(b.name));
}

export async function updateContact(
  contactId: string,
  name: string,
  phone: string,
  relationship: string
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, contactId), { name, phone, relationship });
}

export async function deleteContact(contactId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, contactId));
}
