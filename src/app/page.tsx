import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard-view";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View and manage your active AI-assisted content drafts.",
};

export default function DashboardPage() {
  return <DashboardView />;
}
