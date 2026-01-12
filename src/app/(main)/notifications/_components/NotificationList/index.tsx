"use client";

import {
  notificationService,
  type NotificationReadStatus,
  type NotificationResponseDTO,
  type RecipientRole,
} from "@/layouts/header/_service/notification.service";
import { cn } from "@/utils/cn";
import { toPublicUrl } from "@/utils/storage/url";
import { AnimatePresence, motion } from "framer-motion";
import _ from "lodash";
import { Bell, CheckCheck, ChevronRight, Inbox, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Props {
  recipientRole: RecipientRole;
}

const NotificationSkeleton = () => (
  <div className="flex items-center gap-4 p-4 rounded-[1.8rem] border border-gray-100 bg-white h-23">
    <div className="shrink-0 w-12 h-12 rounded-2xl bg-gray-50 overflow-hidden">
      <Skeleton height="100%" width="100%" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between mb-2">
        <Skeleton width="40%" height={14} />
        <Skeleton width="20%" height={10} />
      </div>
      <Skeleton width="90%" height={16} />
    </div>
  </div>
);

export default function NotificationList({ recipientRole }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [notifications, setNotifications] = useState<NotificationResponseDTO[]>(
    []
  );
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [statusFilter, setStatusFilter] = useState<
    NotificationReadStatus | "ALL"
  >("ALL");

  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "0px 0px 400px 0px",
  });

  const fetchNotifications = useCallback(
    async (pageNum: number, isReset: boolean) => {
      if (isFetching) return;
      try {
        if (isReset) {
          setLoading(true);
          setNotifications([]);
        }
        setIsFetching(true);

        const response = await notificationService.list({
          recipientRole,
          status:
            statusFilter === "ALL"
              ? undefined
              : (statusFilter as NotificationReadStatus),
          page: pageNum,
          size: 15,
        });

        const newContent = _.get(response, "content", []);
        setNotifications((prev) =>
          isReset ? newContent : [...prev, ...newContent]
        );
        setHasMore(!response.last && newContent.length > 0);
        setPage(pageNum);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    },
    [recipientRole, statusFilter, isFetching]
  );

  useEffect(() => {
    fetchNotifications(0, true);
  }, [recipientRole, statusFilter]);

  useEffect(() => {
    if (inView && hasMore && !isFetching && !loading) {
      fetchNotifications(page + 1, false);
    }
  }, [inView, hasMore, isFetching, loading, page, fetchNotifications]);

  const handleNotificationClick = async (
    notification: NotificationResponseDTO
  ) => {
    if (notification.readStatus === "UNREAD") {
      try {
        await notificationService.markRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, readStatus: "READ" } : n
          )
        );
      } catch (e) {
        console.error(e);
      }
    }
    if (notification.redirectUrl) router.push(notification.redirectUrl);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-[2.5rem] border border-gray-200 shadow-[0_12px_40px_rgba(0,0,0,0.03)] overflow-hidden">
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-gray-100 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 shadow-inner">
          {["ALL", "UNREAD", "READ"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s as any)}
              className={cn(
                "px-6 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300",
                statusFilter === s
                  ? "bg-white text-(--color-mainColor) shadow-[0_4px_15px_rgba(0,0,0,0.1)] scale-105 active:scale-100"
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              {s === "ALL" ? "Tất cả" : s === "UNREAD" ? "Chưa đọc" : "Đã đọc"}
            </button>
          ))}
        </div>

        <button
          onClick={() =>
            notificationService
              .markAllRead()
              .then(() => fetchNotifications(0, true))
          }
          className="flex items-center gap-2 px-5 py-2.5 text-[11px] font-bold text-gray-700 hover:text-(--color-mainColor) uppercase tracking-widest transition-all active:scale-95"
        >
          <CheckCheck size={16} strokeWidth={2.5} />
          Đánh dấu đã đọc
        </button>
      </div>

      <div className="flex-1 px-6 pb-6 pt-4 overflow-y-auto no-scrollbar min-h-150 bg-white">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {[...Array(6)].map((_, i) => (
                <NotificationSkeleton key={i} />
              ))}
            </motion.div>
          ) : notifications.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-40"
            >
              <div className="w-20 h-20 bg-orange-50 rounded-[2.2rem] flex items-center justify-center mb-6 border border-orange-100 shadow-inner">
                <Inbox size={36} className="text-orange-300" />
              </div>
              <p className="text-[12px] font-bold uppercase tracking-[0.25em] text-gray-500 italic">
                Hộp thư trống
              </p>
            </motion.div>
          ) : (
            <motion.div key="notification-list" className="space-y-3">
              {notifications.map((item, index) => (
                <motion.div
                  key={`${item.id}-${index}`}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  onClick={() => handleNotificationClick(item)}
                  className={cn(
                    "group relative flex items-center gap-4 p-4 rounded-[1.8rem] border transition-all duration-500 cursor-pointer h-23",
                    item.readStatus === "UNREAD"
                      ? "bg-white border-orange-300 shadow-[0_10px_35px_rgba(249,115,22,0.1)] ring-1 ring-orange-100"
                      : "bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50/40"
                  )}
                >
                  {item.readStatus === "UNREAD" && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-(--color-mainColor) rounded-full shadow-[0_0_12px_rgba(249,115,22,1)]" />
                  )}

                  <div className="shrink-0 w-12 h-12 relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm transition-all group-hover:scale-110 group-hover:rotate-2">
                    {item.imageUrl ? (
                      <Image
                        src={toPublicUrl(item.imageUrl)}
                        alt="Notification Icon"
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Bell size={22} strokeWidth={2.2} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4
                        className={cn(
                          "text-[13px] uppercase tracking-tight italic line-clamp-1 transition-colors",
                          item.readStatus === "UNREAD"
                            ? "font-bold text-gray-950"
                            : "font-bold text-gray-700"
                        )}
                      >
                        {item.title || "Calatha System"}
                      </h4>
                      {/* <span
                        className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5 shrink-0 ml-4 italic whitespace-nowrap bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100"
                        title={formatDateTime(item.createdAt)}
                      >
                        <Calendar size={11} strokeWidth={2.5} />
                        {formatTimeSince(item.createdAt)}
                      </span> */}
                    </div>
                    <p
                      className={cn(
                        "text-[14px] line-clamp-1 leading-relaxed transition-colors",
                        item.readStatus === "UNREAD"
                          ? "text-gray-900 font-medium"
                          : "text-gray-500 font-normal"
                      )}
                    >
                      {item.content}
                    </p>
                  </div>

                  <div
                    className={cn(
                      "w-9 h-9 rounded-2xl flex items-center justify-center bg-gray-50 border border-gray-100 opacity-0 group-hover:opacity-100 transition-all",
                      "group-hover:bg-(--color-mainColor) group-hover:text-white group-hover:border-transparent shrink-0 shadow-sm translate-x-4 group-hover:translate-x-0"
                    )}
                  >
                    <ChevronRight size={18} strokeWidth={3} />
                  </div>
                </motion.div>
              ))}

              <div
                ref={ref}
                className="py-16 flex flex-col items-center justify-center gap-4"
              >
                {isFetching && hasMore && (
                  <>
                    <Loader2
                      className="animate-spin text-(--color-mainColor)"
                      size={32}
                      strokeWidth={2.5}
                    />
                    <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-500 animate-pulse">
                      Cập nhật thông báo...
                    </p>
                  </>
                )}
                {!hasMore && notifications.length > 0 && (
                  <div className="flex items-center gap-4 w-full max-w-sm">
                    <div className="h-px flex-1 bg-gray-100" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 italic">
                      Đã xem hết
                    </span>
                    <div className="h-px flex-1 bg-gray-100" />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
