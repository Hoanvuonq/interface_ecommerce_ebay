"use client";

import { AppPopover } from "@/components/appPopover";
import { DropdownContainer } from "@/components";
import { useAuth } from "@/hooks/useAuth";
import { Bell, CheckCircle, Eye, Package, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { notificationService } from "../../_service/notification.service";
import { NotificationList } from "../notificationList";
import _ from "lodash";
import { Trigger } from "../trigger";
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
      setUnreadCount(_.filter(data, { readStatus: "UNREAD" }).length);
    } catch (error) {
      console.error("Lỗi load notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) loadRecentNotifications();
  }, [isAuthenticated, loadRecentNotifications]);

  const handleMarkAllRead = async () => {
    await notificationService.markAllRead();
    loadRecentNotifications();
  };
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
    const iconClass = isUnread ? "text-orange-600" : "text-gray-600";
    return category === "ORDER" ? (
      <Package size={20} className={iconClass} />
    ) : category === "SYSTEM" ? (
      <Info size={20} className={iconClass} />
    ) : (
      <Bell size={20} className={iconClass} />
    );
  };

  const NotificationTrigger = (
    <Trigger
      mounted={mounted}
      unreadCount={unreadCount}
      icon={
        <Bell
          size={24}
          className="group-hover:rotate-12 transition-transform"
        />
      }
    />
  );

  if (!isAuthenticated || !mounted) return null;

  return (
    <AppPopover
      trigger={NotificationTrigger}
      align="right"
      onOpenChange={(open) => open && loadRecentNotifications()}
    >
      <DropdownContainer
        title="Thông báo mới"
        icon={<Bell size={18} />}
        footerActions={[
          {
            label: "Đọc hết",
            onClick: handleMarkAllRead,
            icon: <CheckCircle size={14} />,
            variant: "secondary",
          },
          {
            label: "Xem tất cả",
            onClick: () => router.push("/notifications"),
            icon: <Eye size={14} />,
            variant: "primary",
          },
        ]}
      >
        <NotificationList
          notifications={notifications}
          onRead={handleItemClick}
          getIcon={getNotificationIcon}
        />
      </DropdownContainer>
    </AppPopover>
  );
};
