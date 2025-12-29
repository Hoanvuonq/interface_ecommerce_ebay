"use client";

import PageTransition from "@/features/PageTransition";
import { useEffect, useState } from "react";
import EmployeeHeader from "./Header_Employee";
import EmployeeSidebar from "./Sidebar_Employee";
// import {
//   EmployeeChatWidget,
//   EmployeeInternalChatWidget,
// } from "@/features/manager/chat/components";
// import { useEmployeeConversations } from "@/features/manager/chat/hooks";
// import { ConversationType } from "@/features/manager/chat/dto/chat.dto";
import { cn } from "@/utils/cn";
import { MessageCircle, X } from "lucide-react";
import "../../../employee-layout.css";

// Import debug utilities (only in development)
// if (process.env.NODE_ENV === "development") {
//   import("@/features/manager/chat/utils/websocket-debug");
// }

export const BaseEmployeeLayout = ({
  children,
}: {
  children: React.ReactNode;
})=> {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [internalChatOpen, setInternalChatOpen] = useState(false);
  const [floatButtonOpen, setFloatButtonOpen] = useState(false); // Manages floating button group state

  // Get unread count for badge (support chat)
//   const { unreadCount, initialize, allConversations } = useEmployeeConversations();

  // Calculate unread count for internal chat (GROUP conversations only)
//   const internalChatUnreadCount = (allConversations || [])
//     .filter((conv) => conv.conversationType === ConversationType.GROUP)
//     .reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);

  // Initialize conversations only once when component mounts
//   useEffect(() => {
//     initialize();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992; // lg breakpoint
      setIsMobile(mobile);

      // Auto collapse on tablet
      if (window.innerWidth < 1200 && window.innerWidth >= 992) {
        setCollapsed(true);
      } else if (window.innerWidth >= 1200) {
        setCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileDrawerOpen(!mobileDrawerOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const closeMobileDrawer = () => {
    setMobileDrawerOpen(false);
  };

  const handleSupportChatClick = () => {
    setChatOpen(true);
    setFloatButtonOpen(false);
  };

  const handleInternalChatClick = () => {
    setInternalChatOpen(true);
    setFloatButtonOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex overflow-hidden font-sans text-slate-800">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <EmployeeSidebar 
          collapsed={collapsed} 
          className={cn(
            "transition-all duration-300 ease-in-out z-30 shrink-0",
            collapsed ? "w-20" : "w-64"
          )}
        />
      )}

      {/* Mobile Drawer (Custom implementation instead of Antd Drawer) */}
      {isMobile && mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={closeMobileDrawer}
          />
          {/* Drawer Content */}
          <div className="relative w-64 bg-white shadow-2xl h-full transform transition-transform duration-300 ease-in-out animate-in slide-in-from-left">
            <button 
              onClick={closeMobileDrawer}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 text-slate-500"
            >
              <X size={20} />
            </button>
            <EmployeeSidebar
              collapsed={false}
              onMobileMenuClick={closeMobileDrawer}
              className="h-full border-none w-full"
            />
          </div>
        </div>
      )}

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#fafafa]">
        {/* Header */}
        <EmployeeHeader
          onToggleSidebar={toggleSidebar}
          collapsed={collapsed}
          isMobile={isMobile}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto w-full">
             <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </div>

         <div className="fixed right-6 bottom-6 z-40 flex flex-col gap-3 items-end">
        {floatButtonOpen && (
          <div className="flex flex-col gap-3 animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center gap-3">
              <span className="bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg opacity-0 animate-in fade-in duration-300 fill-mode-forwards delay-75">
                Chat nội bộ
              </span>
              {/* <button
                onClick={handleInternalChatClick}
                className="relative w-12 h-12 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center text-blue-600 hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all duration-200 group"
              >
                <Users size={20} strokeWidth={2.5} />
                {internalChatUnreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                    {internalChatUnreadCount > 9 ? '9+' : internalChatUnreadCount}
                  </span>
                )}
              </button> */}
            </div>

            <div className="flex items-center gap-3">
              <span className="bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg opacity-0 animate-in fade-in duration-300 fill-mode-forwards">
                Chat hỗ trợ
              </span>
              {/* <button
                onClick={handleSupportChatClick}
                className="relative w-12 h-12 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center text-orange-500 hover:bg-orange-50 hover:scale-105 active:scale-95 transition-all duration-200 group"
              >
                <MessageSquare size={20} strokeWidth={2.5} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button> */}
            </div>
          </div>
        )}

        {/* Main Trigger Button */}
        <button
          onClick={() => setFloatButtonOpen(!floatButtonOpen)}
          className={cn(
            "w-14 h-14 rounded-2xl shadow-[0_8px_30px_rgba(249,115,22,0.4)] flex items-center justify-center text-white transition-all duration-300 hover:scale-105 active:scale-95",
            floatButtonOpen ? "bg-slate-900 rotate-45" : "bg-gradient-to-br from-orange-500 to-amber-500"
          )}
        >
          {floatButtonOpen ? <X size={24} strokeWidth={3} /> : <MessageCircle size={28} strokeWidth={2.5} />}
          
          {/* Total Badge on Main Button (if collapsed) */}
          {/* {!floatButtonOpen && (unreadCount + internalChatUnreadCount > 0) && (
             <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md ring-2 ring-white animate-bounce">
               {unreadCount + internalChatUnreadCount > 9 ? '!' : unreadCount + internalChatUnreadCount}
             </span>
          )} */}
        </button>
      </div>

      {/* Chat Widgets (Portals or Fixed Overlays) */}
      {/* {chatOpen && (
        <div className="fixed bottom-24 right-6 z-50 animate-in slide-in-from-bottom-10 duration-300">
           <EmployeeChatWidget onClose={() => setChatOpen(false)} />
        </div>
      )} */}

      {/* {internalChatOpen && (
        <div className="fixed bottom-24 right-6 z-50 animate-in slide-in-from-bottom-10 duration-300">
           <EmployeeInternalChatWidget onClose={() => setInternalChatOpen(false)} />
        </div>
      )} */}
    </div>
  );
}