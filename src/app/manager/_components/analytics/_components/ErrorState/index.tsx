"use client";

import React from 'react';
import { RefreshCw, AlertTriangle, WifiOff, ShieldAlert } from 'lucide-react';
import { cn } from "@/utils/cn";

export interface ErrorStateProps {
    error: Error | any;
    onRetry?: () => void;
    className?: string;
}

export function ErrorState({ error, onRetry, className }: ErrorStateProps) {
    const errorMessage = error?.message || 'Đã xảy ra lỗi không xác định';
    const isNetworkError = errorMessage.toLowerCase().includes('network') || 
                          errorMessage.toLowerCase().includes('timeout') ||
                          errorMessage.toLowerCase().includes('fetch');

    return (
        <div className={cn(
            "flex items-center justify-center min-h-112.5 p-6 animate-in fade-in duration-500",
            className
        )}>
            <div className="max-w-md w-full text-center space-y-6">
                <div className="relative inline-flex items-center justify-center">
                    <div className="absolute inset-0 bg-rose-100 rounded-4xl blur-2xl opacity-50 animate-pulse" />
                    <div className="relative w-24 h-24 bg-white rounded-4xl border border-rose-100 shadow-xl shadow-rose-100/50 flex items-center justify-center group transition-transform hover:scale-105">
                        {isNetworkError ? (
                            <WifiOff className="text-rose-500 w-10 h-10" strokeWidth={2.5} />
                        ) : (
                            <ShieldAlert className="text-rose-500 w-10 h-10" strokeWidth={2.5} />
                        )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-rose-500 text-white p-1.5 rounded-xl border-4 border-white shadow-lg">
                        <AlertTriangle size={14} fill="currentColor" stroke="none" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900 uppercase tracking-tighter italic">
                        Ops! <span className="text-rose-500">Đã có lỗi xảy ra</span>
                    </h3>
                    <p className="text-sm font-bold text-gray-600 uppercase tracking-widest leading-relaxed px-4">
                        {isNetworkError
                            ? 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền internet.'
                            : errorMessage}
                    </p>
                </div>

                {/* Action Section */}
                {onRetry && (
                    <div className="pt-2">
                        <button
                            onClick={onRetry}
                            className="group relative inline-flex items-center gap-3 px-10 py-4 bg-linear-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white rounded-3xl font-semibold uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-rose-200 active:scale-95"
                        >
                            <RefreshCw 
                                size={18} 
                                strokeWidth={3} 
                                className="group-hover:rotate-180 transition-transform duration-500" 
                            />
                            Thử lại ngay
                        </button>
                    </div>
                )}

                {/* Footer Decor */}
                <div className="pt-4 opacity-30 select-none pointer-events-none">
                    <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-[0.3em]">
                        CaLaTha Security System
                    </p>
                </div>
            </div>
        </div>
    );
}