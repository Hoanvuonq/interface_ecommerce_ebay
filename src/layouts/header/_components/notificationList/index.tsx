"use client";

import _ from "lodash";
import { Bell } from "lucide-react";
import { cn } from "@/utils/cn";
import { toPublicUrl } from "@/utils/storage/url";
import Image from "next/image";

export const NotificationList = ({ notifications, onRead, getIcon }: any) => {
  if (_.isEmpty(notifications)) {
    return (
      <div className="p-12 text-center flex flex-col items-center gap-3">
        <Bell size={40} className="text-gray-200" />
        <p className="text-gray-600 font-bold text-xs uppercase tracking-widest">
          Không Có Thông Báo Mới
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-gray-100/50">
      {notifications.slice(0, 9).map((notif: any) => {
        const isUnread = notif.readStatus === "UNREAD";
        return (
          <div
            key={notif.id}
            onClick={() => onRead(notif.id, notif.redirectUrl)}
            className={cn(
              "flex items-start gap-4 p-4 transition-all cursor-pointer relative",
              isUnread
                ? "bg-white hover:bg-orange-50/50 shadow-[inset_4px_0_0_0_#f97316]"
                : "bg-transparent opacity-80 hover:bg-gray-50"
            )}
          >
            <div
              className={cn(
                "shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center border transition-all duration-300",
                isUnread
                  ? "bg-orange-100 border-gray-200 shadow-sm"
                  : "bg-gray-100 border-gray-200"
              )}
            >
              {notif.imageUrl ? (
                <Image
                  src={toPublicUrl(notif.imageUrl)}
                  alt="Thông Báo"
                  width={14}
                  height={14}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                getIcon(notif.category, isUnread)
              )}
            </div>

            <div className="text-sm min-w-0 flex-1">
              <p
                className={cn(
                  "line-clamp-1 leading-none mb-1.5 uppercase text-[11px] tracking-tight",
                  isUnread
                    ? "font-semibold text-gray-900"
                    : "font-bold text-gray-500"
                )}
              >
                {notif.title}
              </p>
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-medium">
                {notif.content}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">
                  {new Date(notif.createdDate).toLocaleDateString("vi-VN")}
                </span>
                {isUnread && (
                  <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]" />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
