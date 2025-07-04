import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "MindPulse - Your Mind, Amplified. Your Future, Simplified.",
  description: "Revolutionary digital twin platform for personal growth. Create your AI-powered digital self with quantum decisions, knowledge graphs, and value monetization.",
  keywords: "AI, digital twin, personal growth, quantum decisions, knowledge graph, asset allocation",
  openGraph: {
    title: "MindPulse - Your Mind, Amplified. Your Future, Simplified.",
    description: "Revolutionary digital twin platform for personal growth.",
    type: "website",
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 