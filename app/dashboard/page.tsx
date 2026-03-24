"use client";

import MoodTracker from "@/src/components/MoodTracker";
import ResourcePreview from "@/src/components/ResourcePreview";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Mood check-in */}
      <MoodTracker />

      {/* Resource preview */}
      <ResourcePreview />
    </div>
  );
}
