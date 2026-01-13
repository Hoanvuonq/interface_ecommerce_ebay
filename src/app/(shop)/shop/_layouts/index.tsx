"use client";

import React, { useState } from "react";
import ShopSidebar from "./Sidebar_Shop";
import ShopHeader from "./Header_Shop";
import PageTransition from "@/features/PageTransition";
import { cn } from "@/utils/cn";
// import { FloatingShopCustomerChatButton, FloatingShopSupportButton } from "../chat";

export function BaseShopLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
  <div className="flex min-h-screen bg-[#f5f7ff]">
      <ShopSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-500"
        )}
      >
        <ShopHeader
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="min-h-[calc(100vh-120px)] p-2 animate-in fade-in duration-700">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>

        {/* <FloatingShopCustomerChatButton /> */}
        {/* <FloatingShopSupportButton /> */}
      </div>
    </div>
  );
}
