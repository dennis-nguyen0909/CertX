"use client";

import SystemActivities from "@/components/SystemActivities";
import { useGuardRoute } from "@/hooks/use-guard-route";

export default function HistoryPage() {
  useGuardRoute();
  return <SystemActivities />;
}
