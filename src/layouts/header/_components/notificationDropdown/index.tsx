"use client";

import { Bell, Eye, CheckCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { AppPopover } from '@/components/appPopover';

const unreadCount = 5;
const notifications = [
  { id: 1, title: 'Đơn hàng ORD-MJ6MWGRV-C443 đã được tạo', subtitle: 'Tổng tiền: 20,772,201.00đ', isRead: false },
  { id: 2, title: 'Đơn hàng mới #ORD-MJ3NDJ71-9B35', subtitle: 'Bạn có đơn hàng mới từ Le Thuong.', isRead: false },
  { id: 3, title: 'Đơn hàng ORD-MJ3NFHDG-EA8D đã được tạo', subtitle: 'Tổng tiền: 12,015,050.50đ', isRead: true },
];

export const NotificationDropdown = () => {
    const Trigger = (
        <div className="p-2 relative rounded-full text-white hover:bg-white/10 transition-colors cursor-pointer">
            <Bell size={20} />
            {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-600 text-[10px] text-white font-bold ring-2 ring-[var(--color-primary)]">
                    {unreadCount > 9 ? '9+' : unreadCount}
                </span>
            )}
        </div>
    );

    return (
        <AppPopover trigger={Trigger} className="w-80" align="right">
            <div className="p-3 font-bold text-base border-b border-gray-100 bg-white">Thông báo</div>
            
            <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map((notif) => (
                        <Link
                            key={notif.id}
                            href={`/notifications/${notif.id}`}
                            className={cn(
                                "flex items-start gap-3 p-3 transition-colors border-b border-gray-50 last:border-0",
                                notif.isRead ? "hover:bg-gray-50" : "bg-blue-50/50 hover:bg-blue-50"
                            )}
                        >
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <Bell size={14} className={notif.isRead ? "text-gray-400" : "text-blue-600"} />
                            </div>
                            <div className="text-sm min-w-0">
                                <p className={cn("truncate", notif.isRead ? "text-gray-600" : "font-bold text-gray-900")}>
                                    {notif.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">{notif.subtitle}</p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-400 text-sm">Không có thông báo mới.</div>
                )}
            </div>

            <div className="flex flex-col p-2 bg-gray-50/50">
                <button className="flex items-center justify-center gap-1 py-1.5 text-xs text-pink-600 hover:text-pink-700 font-semibold">
                    <CheckCircle size={14} /> Đánh dấu tất cả đã đọc
                </button>
                <Link href="/notifications" className="flex items-center justify-center gap-1 py-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold border-t border-gray-100 mt-1">
                    Xem tất cả thông báo <Eye size={14} />
                </Link>
            </div>
        </AppPopover>
    );
};