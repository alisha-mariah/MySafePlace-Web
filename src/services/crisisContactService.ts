import { collection, getDocs } from "firebase/firestore";
import { db } from "@/src/lib/firebaseClient";

export interface CrisisContact {
  id: string;
  name: string;
  description: string;
  phone: string;
  sms: string;
  chatUrl: string;
  category: string;
  availability: string;
  sortOrder: number;
}

const COLLECTION = "crisisContacts";

/* Hardcoded fallback so crisis numbers always appear, even before admin setup */
const FALLBACK: CrisisContact[] = [
  { id: "f0", name: "988 Suicide & Crisis Lifeline", description: "Free, confidential support available 24/7 for anyone in emotional distress or suicidal crisis. You don't have to go through this alone.", phone: "988", sms: "988", chatUrl: "https://988lifeline.org/chat/", category: "primary", availability: "24/7", sortOrder: 0 },
  { id: "f1", name: "Crisis Text Line", description: "Free crisis counseling via text message, 24/7.", phone: "", sms: "741741", chatUrl: "https://www.crisistextline.org/", category: "general", availability: "24/7", sortOrder: 1 },
  { id: "f2", name: "SAMHSA National Helpline", description: "Free referral service for substance abuse and mental health. 24/7.", phone: "1-800-662-4357", sms: "", chatUrl: "", category: "general", availability: "24/7", sortOrder: 2 },
  { id: "f3", name: "Veterans Crisis Line", description: "Support for veterans and their loved ones.", phone: "988", sms: "838255", chatUrl: "https://www.veteranscrisisline.net/get-help-now/chat/", category: "general", availability: "24/7", sortOrder: 3 },
  { id: "f4", name: "National Domestic Violence Hotline", description: "Confidential support for anyone affected by domestic violence. 24/7.", phone: "1-800-799-7233", sms: "22233", chatUrl: "https://www.thehotline.org/", category: "general", availability: "24/7", sortOrder: 4 },
  { id: "f5", name: "Trevor Project (LGBTQ+ Youth)", description: "Crisis intervention and suicide prevention for LGBTQ+ young people under 25.", phone: "1-866-488-7386", sms: "678-678", chatUrl: "https://www.thetrevorproject.org/get-help/", category: "general", availability: "24/7", sortOrder: 5 },
  { id: "f6", name: "NAMI Helpline", description: "Information and support for mental health conditions.", phone: "1-800-950-6264", sms: "62640", chatUrl: "", category: "general", availability: "Mon–Fri, 10am–10pm ET", sortOrder: 6 },
];

export async function getActiveCrisisContacts(): Promise<CrisisContact[]> {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    const contacts = snapshot.docs
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
        };
      })
      .filter((_, i, arr) => {
        const src = snapshot.docs[i].data();
        return src.active !== false;
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);

    return contacts.length > 0 ? contacts : FALLBACK;
  } catch {
    return FALLBACK;
  }
}
