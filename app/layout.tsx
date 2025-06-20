import React from "react";
import type { Metadata } from "next";
import StoreProvider from "@/lib/providers/StoreProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindPulse - 量子智能决策与图谱社交系统",
  description:
    "革新性个人认知成长平台，融合量子智能决策、知识图谱社交、价值交易和认知探索",
  keywords: [
    "mindpulse",
    "quantum-computing",
    "knowledge-graph",
    "ai",
    "social-network",
  ],

  authors: [
    {
      name: "MindPulse Team",
    },
  ],

  viewport: "width=device-width, initial-scale=1",
  themeColor: "#00FFFF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark" data-oid="p4i1bqv">
      <head data-oid="c1-:l0s">
        <link rel="icon" href="/favicon.ico" data-oid="l9z..fe" />
        <link rel="manifest" href="/manifest.json" data-oid="jmo978t" />
      </head>
      <body className="bg-gray-900 text-white antialiased" data-oid="a1s1yxv">
        <StoreProvider data-oid="r3.o4vd">{children}</StoreProvider>
      </body>
    </html>
  );
}
