"use client";

import { cn } from '@/utils/cn';
import { Grid, Home, Info, Settings, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuItems = [
    { href: '/', label: 'Trang chủ', icon: Home },
    { href: '/products', label: 'Tất cả các sản phẩm', icon: Grid },
    { href: '/about', label: 'Giới thiệu', icon: Info },
    { href: '/system', label: 'Hệ thống', icon: Settings },
];

export const MobileMenuDrawer = ({ isOpen, onClose }: DrawerProps) => {
    
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const drawerClasses = cn(
        "fixed top-0 left-0 h-full w-full max-w-xs bg-white shadow-2xl z-[1000] transform transition-transform duration-300 ease-in-out",
        isOpen ? 'translate-x-0' : '-translate-x-full'
    );

    const backdropClasses = cn(
        "fixed inset-0 bg-black/50 z-[999] transition-opacity duration-300",
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
    );

    return (
        <>
            <div
                className={backdropClasses}
                onClick={onClose}
                aria-hidden={!isOpen}
            />

            <div className={drawerClasses} role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 id="mobile-menu-title" className="text-xl font-bold text-gray-800 flex items-center">
                        Danh sách
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                        aria-label="Đóng Menu"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-4">
                    <ul className="space-y-1">
                        {menuItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={onClose}
                                        className="flex items-center gap-4 py-3 px-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-colors font-medium text-base"
                                    >
                                        <IconComponent size={20} className="flex-shrink-0" />
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </>
    );
};