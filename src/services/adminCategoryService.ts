import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  arrayUnion,
  arrayRemove,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/src/lib/firebaseClient";

export interface Category {
  id: string;
  name: string;
  subcategories: string[];
}

const COLLECTION = "resourceCategories";

export async function getCategories(): Promise<Category[]> {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs
    .map((d) => ({
      id: d.id,
      name: d.data().name ?? "",
      subcategories: d.data().subcategories ?? [],
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Scans all existing resources and creates any categories/subcategories
 * that don't already exist in the resourceCategories collection.
 * Safe to call on every page load — only writes when something is missing.
 */
export async function syncCategoriesFromResources(): Promise<void> {
  const existing = await getCategories();
  const existingMap = new Map(existing.map((c) => [c.name, c]));

  const resourcesSnap = await getDocs(collection(db, "resources"));
  const discovered = new Map<string, Set<string>>();

  resourcesSnap.docs.forEach((d) => {
    const data = d.data();
    const cat = (data.category ?? "").trim();
    const sub = (data.subcategory ?? "").trim();
    if (!cat) return;
    if (!discovered.has(cat)) discovered.set(cat, new Set());
    if (sub) discovered.get(cat)!.add(sub);
  });

  for (const [catName, subs] of discovered) {
    const match = existingMap.get(catName);
    if (!match) {
      // Category doesn't exist yet — create it with all discovered subcategories
      await addDoc(collection(db, COLLECTION), {
        name: catName,
        subcategories: Array.from(subs),
        createdAt: Timestamp.now(),
      });
    } else {
      // Category exists — merge in any missing subcategories
      const missing = Array.from(subs).filter((s) => !match.subcategories.includes(s));
      for (const s of missing) {
        await updateDoc(doc(db, COLLECTION, match.id), {
          subcategories: arrayUnion(s),
        });
      }
    }
  }
}

export async function addCategory(name: string): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    name,
    subcategories: [],
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateCategoryName(id: string, name: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { name });
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

export async function addSubcategory(categoryId: string, subcategory: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, categoryId), {
    subcategories: arrayUnion(subcategory),
  });
}

export async function removeSubcategory(categoryId: string, subcategory: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, categoryId), {
    subcategories: arrayRemove(subcategory),
  });
}

export async function renameSubcategory(
  categoryId: string,
  oldName: string,
  newName: string
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, categoryId), {
    subcategories: arrayRemove(oldName),
  });
  await updateDoc(doc(db, COLLECTION, categoryId), {
    subcategories: arrayUnion(newName),
  });
}
