import { Metadata } from "next";
import MindPulseLayout from "@/components/layout/MindPulseLayout";
import BrowserView from "@/components/browser/BrowserView";

export const metadata: Metadata = {
  title: "MindPulse - 量子智能决策与图谱社交系统",
  description:
    "革新性个人认知成长平台，融合量子智能决策、知识图谱社交、价值交易和认知探索",
};

export default function HomePage() {
  return (
    <MindPulseLayout>
      <BrowserView className="h-full" />
    </MindPulseLayout>
  );
}
