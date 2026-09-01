import type { Metadata } from "next";
import { HistoryView } from "@/components/history-view";

export const metadata: Metadata = {
  title: "Version History",
  description: "View version history and update timelines for your drafts.",
};

export default function HistoryPage() {
  return <HistoryView />;
}
