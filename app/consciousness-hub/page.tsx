import { Metadata } from "next";
import MindPulseLayout from "@/components/layout/MindPulseLayout";
import BrowserView from "@/components/browser/BrowserView";

export const metadata: Metadata = {
  title: "Consciousness Hub - Free Experience | MindPulse",
  description:
    "Experience MindPulse for free. Explore our consciousness hub and discover the power of AI-driven personal growth.",
};

export default function ConsciousnessHubPage() {
  return (
    <MindPulseLayout>
      <BrowserView className="h-full" />
    </MindPulseLayout>
  );
} 