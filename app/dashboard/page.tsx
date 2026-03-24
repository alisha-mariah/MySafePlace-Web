"use client";

import MoodTracker from "@/src/components/MoodTracker";
import ResourcePreview from "@/src/components/ResourcePreview";
import WeeklyMood from "@/src/components/WeeklyMood";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="card-drop">
        <MoodTracker />
      </div>

      <div className="card-drop-1">
        <ResourcePreview />
      </div>

      <div className="card-drop-2">
        <WeeklyMood />
      </div>
    </div>
  );
}
