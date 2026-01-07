"use client";

import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import PageTransition from "@/features/PageTransition";
import EmployeeHeader from "./Header_Employee";
import EmployeeSidebar from "./Sidebar_Employee";
import { FloatingActionButtons } from "./_components/FloatingActionButtons";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { cn } from "@/utils/cn";

export const BaseEmployeeLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { collapsed, setCollapsed, isMobile, isMounted } = useResponsiveLayout();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const sidebarWidth = useMemo(() => {
    if (isMobile) return 0;
    return collapsed ? 80 : 256;
  }, [collapsed, isMobile]);

  if (!isMounted) return <div className="h-screen w-full bg-[#fafafa]" />;

  return (
    <div className="h-screen w-full bg-[#fafafa] flex overflow-hidden font-sans text-gray-800 antialiased">
      {!isMobile && (
        <aside 
          style={{ width: `${sidebarWidth}px` }} 
          className="h-full transition-[width] duration-300 ease-in-out shrink-0 border-r border-gray-200 bg-white z-30 overflow-hidden"
        >
          <EmployeeSidebar collapsed={collapsed} />
        </aside>
      )}

      <div className={cn(
        "fixed inset-0 z-50 transition-opacity duration-300",
        isMobile && mobileDrawerOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      )}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileDrawerOpen(false)} />
        <div className={cn(
          "absolute left-0 top-0 w-64 h-full bg-white shadow-2xl transition-transform duration-300 ease-in-out",
          mobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <EmployeeSidebar 
            collapsed={false} 
            onMobileMenuClick={() => setMobileDrawerOpen(false)} 
            className="w-full h-full" 
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <EmployeeHeader 
          onToggleSidebar={() => isMobile ? setMobileDrawerOpen(true) : setCollapsed(!collapsed)} 
          collapsed={collapsed} 
          isMobile={isMobile} 
        />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative bg-gray-50/50 custom-scrollbar">
          <div className="max-w-8xl mx-auto p-4 md:p-6 lg:p-8 min-h-full">
            <PageTransition key={pathname}>
              {children}
            </PageTransition>
          </div>
        </main>
      </div>

      <FloatingActionButtons />
    </div>
  );
};