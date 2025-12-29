"use client";

import { useState, useEffect } from "react";
import PageTransition from "@/features/PageTransition";
import EmployeeHeader from "./Header_Employee";
import EmployeeSidebar from "./Sidebar_Employee";
import { cn } from "@/utils/cn";
import { MessageCircle, X, Users, MessageSquare } from "lucide-react";

export const BaseEmployeeLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [floatButtonOpen, setFloatButtonOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (window.innerWidth < 1200 && window.innerWidth >= 992) setCollapsed(true);
      else if (window.innerWidth >= 1200) setCollapsed(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (

    <div className="h-screen w-full bg-[#fafafa] flex overflow-hidden font-sans text-slate-800">
      {!isMobile && (
        <EmployeeSidebar 
          collapsed={collapsed} 
          className={cn(
            "h-full transition-all duration-300 ease-in-out z-30 shrink-0 border-r border-slate-200",
            collapsed ? "w-20" : "w-64"
          )}
        />
      )}

      {isMobile && mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileDrawerOpen(false)} />
          <div className="relative w-64 bg-white h-full shadow-2xl animate-in slide-in-from-left duration-300">
            <EmployeeSidebar collapsed={false} onMobileMenuClick={() => setMobileDrawerOpen(false)} className="w-full h-full" />
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <EmployeeHeader 
           onToggleSidebar={() => isMobile ? setMobileDrawerOpen(true) : setCollapsed(!collapsed)} 
           collapsed={collapsed} 
           isMobile={isMobile} 
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth custom-scrollbar bg-slate-50/50">
          <div className="max-w-8xl mx-auto min-h-full ">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </div>

      <div className="fixed right-6 bottom-6 z-40 flex flex-col gap-3 items-end">
        {floatButtonOpen && (
          <div className="flex flex-col gap-3 animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center gap-3">
              <span className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg">Chat nội bộ</span>
              <button className="w-12 h-12 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center text-blue-600 hover:scale-110 transition-all shadow-blue-500/5">
                <Users size={20} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg">Chat hỗ trợ</span>
              <button className="w-12 h-12 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center text-orange-500 hover:scale-110 transition-all shadow-orange-500/5">
                <MessageSquare size={20} />
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setFloatButtonOpen(!floatButtonOpen)}
          className={cn(
            "w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center text-white transition-all duration-300",
            floatButtonOpen ? "bg-slate-900 rotate-45" : "bg-linear-to-br from-orange-500 to-amber-600 shadow-orange-500/30"
          )}
        >
          {floatButtonOpen ? <X size={24} /> : <MessageCircle size={28} />}
        </button>
      </div>
    </div>
  );
};