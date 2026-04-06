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

export interface AdminResource {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  type: string;
  url: string;
  featured: boolean;
}

export type ResourceFormData = Omit<AdminResource, "id">;

const COLLECTION = "resources";

export async function getAllResources(): Promise<AdminResource[]> {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title ?? "",
      description: data.description ?? "",
      category: data.category ?? "",
      subcategory: data.subcategory ?? "",
      type: data.type ?? "",
      url: data.url ?? "",
      featured: data.featured ?? false,
    };
  });
}

export async function addResource(data: ResourceFormData): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateResource(
  id: string,
  data: Partial<ResourceFormData>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteResource(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
