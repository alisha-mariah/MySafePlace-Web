import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/src/lib/firebaseClient";

export interface AdminCrisisContact {
  id: string;
  name: string;
  description: string;
  phone: string;
  sms: string;
  chatUrl: string;
  category: string;
  availability: string;
  sortOrder: number;
  active: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export type CrisisContactFormData = Omit<AdminCrisisContact, "id" | "createdAt" | "updatedAt">;

const COLLECTION = "crisisContacts";

export async function getAllCrisisContacts(): Promise<AdminCrisisContact[]> {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs
    .map((d) => {
      const data = d.data();
      return {
        id: d.id,
        name: data.name ?? "",
        description: data.description ?? "",
        phone: data.phone ?? "",
        sms: data.sms ?? "",
        chatUrl: data.chatUrl ?? "",
        category: data.category ?? "general",
        availability: data.availability ?? "",
        sortOrder: data.sortOrder ?? 0,
        active: data.active ?? true,
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? null,
      };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function addCrisisContact(data: CrisisContactFormData): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), { ...data, createdAt: Timestamp.now() });
  return docRef.id;
}

export async function updateCrisisContact(id: string, data: Partial<CrisisContactFormData>): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: Timestamp.now() });
}

export async function deleteCrisisContact(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

const DEFAULTS: Omit<CrisisContactFormData, "sortOrder">[] = [
  { name: "988 Suicide & Crisis Lifeline", description: "Free, confidential support available 24/7 for anyone in emotional distress or suicidal crisis.", phone: "988", sms: "988", chatUrl: "https://988lifeline.org/chat/", category: "primary", availability: "24/7", active: true },
  { name: "Crisis Text Line", description: "Free crisis counseling via text message, 24/7.", phone: "", sms: "741741", chatUrl: "https://www.crisistextline.org/", category: "general", availability: "24/7", active: true },
  { name: "SAMHSA National Helpline", description: "Free referral service for substance abuse and mental health. 24/7.", phone: "1-800-662-4357", sms: "", chatUrl: "", category: "general", availability: "24/7", active: true },
  { name: "Veterans Crisis Line", description: "Support for veterans and their loved ones.", phone: "988", sms: "838255", chatUrl: "https://www.veteranscrisisline.net/get-help-now/chat/", category: "general", availability: "24/7", active: true },
  { name: "National Domestic Violence Hotline", description: "Confidential support for anyone affected by domestic violence. 24/7.", phone: "1-800-799-7233", sms: "22233", chatUrl: "https://www.thehotline.org/", category: "general", availability: "24/7", active: true },
  { name: "Trevor Project (LGBTQ+ Youth)", description: "Crisis intervention and suicide prevention for LGBTQ+ young people under 25.", phone: "1-866-488-7386", sms: "678-678", chatUrl: "https://www.thetrevorproject.org/get-help/", category: "general", availability: "24/7", active: true },
  { name: "NAMI Helpline", description: "Information and support for mental health conditions.", phone: "1-800-950-6264", sms: "62640", chatUrl: "", category: "general", availability: "Mon–Fri, 10am–10pm ET", active: true },
];

export async function seedDefaultCrisisContacts(): Promise<void> {
  const snapshot = await getDocs(collection(db, COLLECTION));
  if (snapshot.size > 0) return;
  for (let i = 0; i < DEFAULTS.length; i++) {
    await addDoc(collection(db, COLLECTION), { ...DEFAULTS[i], sortOrder: i, createdAt: Timestamp.now() });
  }
}
