"use client";

import React, { useEffect } from "react";
import MindPulseHeader from "../browser/MindPulseHeader";
import MindPulseSidebar from "./MindPulseSidebar";
import { useUI } from "@/lib/store";
import { clsx } from "clsx";

interface MindPulseLayoutProps {
  children: React.ReactNode;
}

export default function MindPulseLayout({ children }: MindPulseLayoutProps) {
  const { sidebarCollapsed, isMobile, isFullScreenBrowserOpen, setIsMobile } = useUI();

  // 检测屏幕尺寸
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [setIsMobile]);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative"
      data-oid="ezcrz3s"
    >
      {/* 背景宇宙效果 */}
      <div className="fixed inset-0 pointer-events-none" data-oid="cqn:0m8">
        {/* 星空背景 */}
        <div className="absolute inset-0" data-oid="5j.51gq">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                animationDelay: `${Math.random() * 3}s`,
                animation: `twinkle ${3 + Math.random() * 3}s infinite`,
              }}
              data-oid="bfg.hy1"
            />
          ))}
        </div>

        {/* 能量波动 */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 animate-pulse"
          data-oid="drg-er-"
        />

        {/* 数据流效果 */}
        <div
          className="absolute top-0 left-0 w-full h-full overflow-hidden"
          data-oid="a28.8no"
        >
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
              style={{
                left: `${i * 12.5}%`,
                top: `${Math.random() * 100}%`,
                width: "200px",
                animation: `dataFlow ${10 + Math.random() * 5}s linear infinite`,
                animationDelay: `${i * 2}s`,
              }}
              data-oid="59a9_jq"
            />
          ))}
        </div>
      </div>

      {/* 侧边栏 - 固定在左侧 */}
      <MindPulseSidebar data-oid="b5b.d8z" />

      {/* Header - 固定在顶部，sidebar右边 */}
      <MindPulseHeader data-oid="rj695oc" />

      {/* Main - 在Header下面，sidebar右边 - 全屏浏览器打开时隐藏 */}
      {!isFullScreenBrowserOpen && (
        <main
        className={clsx(
          // 使用固定定位确保准确位置
          "fixed transition-all duration-300",
          // 顶部留出Header空间 (Header大约120px高)
          "top-[120px] bottom-0",
          // 左侧留出Sidebar空间
          sidebarCollapsed ? "left-16" : "left-64",
          // 右侧到屏幕边缘
          "right-0",
          // 移动端时左侧不留空间
          isMobile && "left-0",
          // 适当的z-index，在Header和Sidebar下方，但在背景上方
          "z-[9997]"
        )}
        data-oid="07jbtrv"
      >
        {/* 内容背景 */}
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          data-oid="luidzl."
        />

        {/* 实际内容 - 可滚动区域 */}
        <div 
          className="relative z-10 h-full overflow-y-auto overflow-x-hidden"
          data-oid="8gadq3x"
        >
          {children}
        </div>
        </main>
      )}

      {/* 自定义样式 */}
      <style jsx data-oid="9ya-cmb">{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes dataFlow {
          0% {
            transform: translateX(-200px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(calc(100vw + 200px));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
