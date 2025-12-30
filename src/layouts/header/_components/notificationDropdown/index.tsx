"use client";

import { AppPopover } from "@/components/appPopover";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";
import { toPublicUrl } from "@/utils/storage/url";
import { Bell, CheckCircle, Eye, Loader2, Package, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { notificationService } from "../../_service/notification.service";
import _ from "lodash";

export const NotificationDropdown = () => {
  const router = useRouter();
  const isAuthenticated = useAuth();
  const [mounted, setMounted] = useState(false);

  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadRecentNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res: any = await notificationService.list({ page: 0, size: 15 });
      const data = _.get(res, "data.content") || _.get(res, "content") || [];

      setNotifications(data);

      const count = _.filter(data, { readStatus: "UNREAD" }).length;
      setUnreadCount(count);

      // if (res?.data?.totalUnread !== undefined) setUnreadCount(res.data.totalUnread);
    } catch (error) {
      console.error("Lỗi load notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadRecentNotifications();
    }
  }, [isAuthenticated, loadRecentNotifications]);

  const handleItemClick = async (id: string, redirectUrl?: string) => {
    try {
      await notificationService.markRead(id);
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readStatus: "READ" } : n))
      );
      if (redirectUrl) router.push(redirectUrl);
    } catch {}
  };

  const getNotificationIcon = (category: string, isUnread: boolean) => {
    const iconClass = isUnread ? "text-orange-600" : "text-gray-400";
    switch (category) {
      case "ORDER":
        return <Package size={20} className={iconClass} />;
      case "SYSTEM":
        return <Info size={20} className={iconClass} />;
      default:
        return <Bell size={20} className={iconClass} />;
    }
  };

  const Trigger = (
    <div className="p-2 relative rounded-full text-white hover:bg-white/10 transition-colors cursor-pointer group">
      <Bell size={24} className="group-hover:rotate-12 transition-transform" />
      {mounted && unreadCount > 0 && (
        <span className="absolute top-0.5 right-0.5 inline-flex items-center justify-center h-4.5 w-4.5 rounded-full bg-[#ee4d2d] text-[10px] text-white font-bold ring-2 ring-orange-600">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </div>
  );

  if (!isAuthenticated || !mounted) return null;

  return (
    <AppPopover
      trigger={Trigger}
      className="w-90 rounded-4xl overflow-hidden border-none shadow-2xl"
      align="right"
      onOpenChange={(open) => open && loadRecentNotifications()}
    >
      <div className="p-4 font-semibold text-sm uppercase tracking-widest border-b border-gray-100 bg-white flex justify-between items-center text-slate-800">
        Thông báo mới
        {loading && (
          <Loader2 size={14} className="animate-spin text-orange-500" />
        )}
      </div>

      <div className="max-h-112.5 overflow-y-auto custom-scrollbar bg-slate-50/30">
        {notifications.length > 0 ? (
          notifications.slice(0, 9).map((notif) => {
            const isUnread = notif.readStatus === "UNREAD";
            return (
              <div
                key={notif.id}
                onClick={() => handleItemClick(notif.id, notif.redirectUrl)}
                className={cn(
                  "flex items-start gap-4 p-4 transition-all border-b border-gray-100/50 cursor-pointer relative",
                  isUnread
                    ? "bg-white hover:bg-orange-50/50 shadow-[inset_4px_0_0_0_#f97316]"
                    : "bg-transparent opacity-80 hover:bg-gray-50"
                )}
              >
                <div
                  className={cn(
                    "shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center border transition-all duration-300",
                    isUnread
                      ? "bg-orange-100 border-orange-200 shadow-sm"
                      : "bg-gray-100 border-gray-200"
                  )}
                >
                  {notif.imageUrl ? (
                    <img
                      src={toPublicUrl(notif.imageUrl)}
                      alt=""
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    getNotificationIcon(notif.category, isUnread)
                  )}
                </div>

                <div className="text-sm min-w-0 flex-1">
                  <p
                    className={cn(
                      "line-clamp-1 leading-none mb-1.5 uppercase text-[11px] tracking-tight",
                      isUnread
                        ? "font-semibold text-slate-900"
                        : "font-bold text-slate-500"
                    )}
                  >
                    {notif.title}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                    {notif.content}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                      {new Date(notif.createdDate).toLocaleDateString("vi-VN")}
                    </span>
                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <Bell size={40} className="text-slate-200" />
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              Sạch bong thông báo
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 p-3 bg-white border-t border-gray-100 gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            notificationService.markAllRead().then(loadRecentNotifications);
          }}
          className="flex items-center justify-center gap-2 py-3 text-[10px] text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-2xl transition-all font-semibold uppercase tracking-widest border border-slate-100"
        >
          <CheckCircle size={14} /> Đọc hết
        </button>
        <Link
          href="/notifications"
          className="flex items-center justify-center gap-2 py-3 text-[10px] text-white bg-slate-900 hover:bg-orange-600 rounded-2xl transition-all font-semibold uppercase tracking-widest shadow-lg shadow-slate-200"
        >
          Xem tất cả <Eye size={14} />
        </Link>
      </div>
    </AppPopover>
  );
};
