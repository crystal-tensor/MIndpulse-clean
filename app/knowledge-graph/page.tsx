"use client";

import React from "react";
import MindPulseLayout from "@/components/layout/MindPulseLayout";
import StoreProvider from "@/lib/providers/StoreProvider";

export default function KnowledgeGraphPage() {
  return (
    <StoreProvider data-oid=".eq.8d0">
      <MindPulseLayout data-oid="cpo9vks">
        <div className="space-y-6" data-oid="-p-63ya">
          {/* 页面头部 */}
          <div
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md border border-purple-500/20 p-6"
            data-oid="4_7af4l"
          >
            <div className="relative z-10" data-oid="ksp8lfq">
              <h1
                className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                data-oid="hblr-:0"
              >
                灵境回廊 - Spirit Corridor
              </h1>
              <p className="text-gray-400 mt-2" data-oid="4t07v1a">
                知识图谱社交中心，构建你的认知宇宙
              </p>
            </div>

            {/* 背景装饰 */}
            <div
              className="absolute inset-0 overflow-hidden"
              data-oid="0fz:a96"
            >
              <div
                className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-400/10 to-transparent rounded-full blur-3xl"
                data-oid="n1tk.6."
              />
            </div>
          </div>

          {/* 功能区域 */}
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            data-oid=".cxfief"
          >
            <div
              className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6"
              data-oid="e::8f_8"
            >
              <h3
                className="text-lg font-semibold text-white mb-4"
                data-oid="x6mi1xs"
              >
                个人知识图谱
              </h3>
              <div
                className="h-64 bg-gray-900/50 rounded-lg flex items-center justify-center"
                data-oid="b_5hei0"
              >
                <p className="text-gray-400" data-oid="3ku2_k_">
                  知识图谱可视化区域
                </p>
              </div>
            </div>

            <div
              className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6"
              data-oid="p812wxx"
            >
              <h3
                className="text-lg font-semibold text-white mb-4"
                data-oid=":7-nen4"
              >
                社交连接
              </h3>
              <div
                className="h-64 bg-gray-900/50 rounded-lg flex items-center justify-center"
                data-oid="3-f39u7"
              >
                <p className="text-gray-400" data-oid="98yfs-a">
                  社交网络展示区域
                </p>
              </div>
            </div>
          </div>
        </div>
      </MindPulseLayout>
    </StoreProvider>
  );
}
