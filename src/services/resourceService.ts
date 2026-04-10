import { collection, getDocs } from "firebase/firestore";
import { db } from "@/src/lib/firebaseClient";

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  type: string;
  url: string;
  featured: boolean;
}

const COLLECTION = "resources";

export function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export async function getResources(): Promise<Resource[]> {
  const snapshot = await getDocs(collection(db, COLLECTION));
  const all = snapshot.docs
    .filter((d) => d.data().hidden !== true)
    .map((d) => {
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

  // Remove duplicates by URL (keep first occurrence)
  const seen = new Set<string>();
  return all.filter((r) => {
    const key = r.url.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
