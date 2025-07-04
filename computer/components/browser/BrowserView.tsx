"use client";

import React, { useState, useEffect } from "react";
import { useBrowser } from "@/lib/store";
import ConsciousnessHub from "@/components/pages/ConsciousnessHub";
import AIExplorationHub from "@/components/pages/AIExplorationHub";
import { clsx } from "clsx";

interface BrowserViewProps {
  className?: string;
}

export default function BrowserView({ className }: BrowserViewProps) {
  const { currentUrl } = useBrowser();
  const [content, setContent] = useState<React.ReactNode>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 调试信息
  console.log("BrowserView - currentUrl:", currentUrl);
  console.log("BrowserView - content:", content);
  console.log("BrowserView - isLoading:", isLoading);

  // 根据URL渲染不同内容
  useEffect(() => {
    const renderContent = async () => {
      console.log("useEffect renderContent - currentUrl:", currentUrl);
      setIsLoading(true);

      // 模拟加载延迟
      await new Promise((resolve) => setTimeout(resolve, 500));

      let renderedContent: React.ReactNode = null;

      // 如果没有URL，默认显示意识枢纽
      const urlToRender = currentUrl || "mindpulse://consciousness-hub";
      console.log("urlToRender:", urlToRender);

      if (
        urlToRender.startsWith("http://") ||
        urlToRender.startsWith("https://")
      ) {
        // 外部网站 - 使用iframe
        renderedContent = (
          <div className="w-full h-full bg-white rounded-lg overflow-hidden">
            <iframe
              src={urlToRender}
              className="w-full h-full border-0"
              title="外部网站"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            />
          </div>
        );
      } else {
        // MindPulse内部页面 - 支持两种格式：mindpulse://和常规路径
        switch (urlToRender) {
          case "/":
          case "mindpulse://consciousness-hub":
            console.log("匹配到意识枢纽路由");
            renderedContent = <ConsciousnessHub />;
            break;
          case "/knowledge-graph":
          case "mindpulse://knowledge-graph":
            renderedContent = (
              <div className="text-center py-20">
                <h1 className="text-4xl font-bold text-cyan-400 mb-4">
                  灵境回廊
                </h1>
                <p className="text-gray-300">知识图谱社交网络正在开发中...</p>
              </div>
            );

            break;
          case "/ai-exploration":
          case "mindpulse://ai-exploration":
            renderedContent = <AIExplorationHub />;
            break;
          case "/quantum-decisions":
          case "mindpulse://quantum-decisions":
            renderedContent = (
              <div className="text-center py-20">
                <h1 className="text-4xl font-bold text-green-400 mb-4">
                  智能决策
                </h1>
                <p className="text-gray-300">量子决策系统正在开发中...</p>
              </div>
            );

            break;
          case "/marketplace":
          case "mindpulse://marketplace":
            renderedContent = (
              <div className="text-center py-20">
                <h1 className="text-4xl font-bold text-yellow-400 mb-4">
                  奇点交易所
                </h1>
                <p className="text-gray-300">价值交易平台正在开发中...</p>
              </div>
            );

            break;
          case "/profile":
          case "mindpulse://profile":
            renderedContent = (
              <div className="text-center py-20">
                <h1 className="text-4xl font-bold text-pink-400 mb-4">
                  自我机体
                </h1>
                <p className="text-gray-300">个人中心正在开发中...</p>
              </div>
            );

            break;
          default:
            // 尝试作为搜索查询处理
            if (currentUrl && !currentUrl.startsWith("mindpulse://")) {
              renderedContent = (
                <div className="text-center py-20">
                  <h1 className="text-2xl font-bold text-cyan-400 mb-4">
                    搜索结果
                  </h1>
                  <p className="text-gray-300 mb-8">搜索词：{currentUrl}</p>
                  <div className="max-w-2xl mx-auto space-y-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-cyan-500/20">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        相关结果 1
                      </h3>
                      <p className="text-gray-300">这是一个模拟的搜索结果...</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-cyan-500/20">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        相关结果 2
                      </h3>
                      <p className="text-gray-300">
                        这是另一个模拟的搜索结果...
                      </p>
                    </div>
                  </div>
                </div>
              );
            } else {
              renderedContent = (
                <div className="text-center py-20">
                  <h1 className="text-2xl font-bold text-red-400 mb-4">
                    页面未找到
                  </h1>
                  <p className="text-gray-300">
                    无法找到请求的页面：{currentUrl}
                  </p>
                </div>
              );
            }
        }
      }

      setContent(renderedContent);
      setIsLoading(false);
    };

    renderContent();
  }, [currentUrl]);

  if (isLoading) {
    return (
      <div
        className={clsx("flex items-center justify-center h-full", className)}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-300">正在加载...</p>
        </div>
      </div>
    );
  }

  return <div className={clsx("w-full h-full", className)}>{content}</div>;
}
