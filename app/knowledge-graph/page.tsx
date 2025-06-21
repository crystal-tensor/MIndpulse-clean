"use client";

import React from "react";
import MindPulseLayout from "@/components/layout/MindPulseLayout";
import StoreProvider from "@/lib/providers/StoreProvider";

export default function KnowledgeGraphPage() {
  return (
    <StoreProvider>
      <MindPulseLayout>
        <div className="space-y-6">
          {/* 页面头部 */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md border border-purple-500/20 p-6">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                灵境回廊 - Spirit Corridor
              </h1>
              <p className="text-gray-400 mt-2">
                知识图谱社交中心，构建你的认知宇宙
              </p>
            </div>

            {/* 背景装饰 */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-400/10 to-transparent rounded-full blur-3xl" />
            </div>
          </div>

          {/* 功能区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                个人知识图谱
              </h3>
              <div className="h-64 bg-gray-900/50 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">知识图谱可视化区域</p>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                社交连接
              </h3>
              <div className="h-64 bg-gray-900/50 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">社交网络展示区域</p>
              </div>
            </div>
          </div>
        </div>
      </MindPulseLayout>
    </StoreProvider>
  );
}
