"use client";

import React, { useEffect } from "react";
import { useApp } from "@/lib/store";

interface StoreProviderProps {
  children: React.ReactNode;
}

export default function StoreProvider({ children }: StoreProviderProps) {
  const { setInitialized } = useApp();

  useEffect(() => {
    // 初始化应用状态
    setInitialized(true);
  }, [setInitialized]);

  return <>{children}</>;
}
