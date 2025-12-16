"use client";

import { useState, useRef, useEffect } from 'react';
import { Bell, AlertCircle, Eye, CheckCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import Link from 'next/link';

const isAuthenticated = true; // Kiểm tra hiển thị
const unreadCount = 5; // Số thông báo chưa đọc
const notifications = [
  { id: 1, title: 'Đơn hàng ORD-MJ6MWGRV-C443 đã được tạo', subtitle: 'Tổng tiền: 20,772,201.00đ', isRead: false, time: 'Vừa xong' },
  { id: 2, title: 'Đơn hàng mới #ORD-MJ3NDJ71-9B35', subtitle: 'Bạn có đơn hàng mới từ Le Thuong.', isRead: false, time: '1 giờ trước' },
  { id: 3, title: 'Đơn hàng ORD-MJ3NFHDG-EA8D đã được tạo', subtitle: 'Tổng tiền: 12,015,050.50đ', isRead: true, time: 'Hôm qua' },
];

const loadRecentNotifications = () => {
    console.log("Loading recent notifications...");
};

export const NotificationDropdown = () => {
    if (!isAuthenticated) return null;
    
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (isOpen) {
            loadRecentNotifications();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 relative rounded-full text-white hover:bg-white/10 transition-colors  cursor-pointer"
                aria-expanded={isOpen}
                aria-label="Thông báo"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span 
                        className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-600 text-[10px] text-white font-bold ring-2 ring-[var(--color-primary)]"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div 
                    className="absolute right-0 top-full mt-2 w-80 max-w-sm bg-white text-gray-800 rounded-lg shadow-xl overflow-hidden z-30 transform origin-top-right"
                    style={{ minWidth: '320px' }} 
                >
                    <div className="p-3 font-bold text-base border-b border-gray-100">Thông báo</div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.map((notif) => (
                            <Link
                                key={notif.id}
                                href={`/notifications/${notif.id}`} 
                                className={cn(
                                    "flex items-start gap-3 p-3 transition-colors",
                                    {
                                        'bg-blue-50 hover:bg-blue-100': !notif.isRead, 
                                        'hover:bg-gray-50': notif.isRead
                                    }
                                )}
                                onClick={() => setIsOpen(false)}
                            >
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                    <Bell size={16} className="text-gray-500" />
                                </div>
                                <div className="text-sm min-w-0">
                                    <p className="font-semibold truncate">{notif.title}</p>
                                    <p className="text-xs text-gray-600 mt-0.5">{notif.subtitle}</p>
                                </div>
                            </Link>
                        ))}
                        {notifications.length === 0 && (
                            <div className="p-4 text-center text-gray-500 text-sm">Không có thông báo mới.</div>
                        )}
                    </div>
                    
                    <div className="flex flex-col p-2 border-t border-gray-100">
                        <button className="flex items-center justify-center gap-1 py-1.5 text-sm text-pink-600 hover:text-pink-700 font-medium">
                            <CheckCircle size={14} /> Đánh dấu tất cả đã đọc
                        </button>
                        <Link href="/notifications" className="flex items-center justify-center gap-1 py-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
                            Xem tất cả thông báo <Eye size={14} />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};