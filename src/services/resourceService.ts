import { collection, getDocs } from "firebase/firestore";
import { db } from "@/src/lib/firebaseClient";

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
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
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title ?? "",
      description: data.description ?? "",
      category: data.category ?? "",
      url: data.url ?? "",
    };
  });
}
