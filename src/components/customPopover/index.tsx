'use client';

import { cn } from "@/utils/cn";
import { useCallback, useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";

interface CustomPopoverProps {
    content: React.ReactNode;
    children: React.ReactNode;
    placement?: 'bottomLeft' | 'bottomRight' | 'top';
}

export const CustomPopover: React.FC<CustomPopoverProps> = ({ content, children, placement = 'bottomLeft' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useClickOutside(containerRef, () => {
        setIsVisible(false);
    });

    const positionClasses = {
        bottomLeft: 'top-full left-0 mt-2 origin-top-left',
        bottomRight: 'top-full right-0 mt-2 origin-top-right',
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2 origin-bottom',
    };

    const showPopover = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsVisible(true);
    }, []);

    const hidePopover = useCallback(() => {
        timeoutRef.current = setTimeout(() => {
            setIsVisible(false);
        }, 150);
    }, []);

    return (
        <div 
            ref={containerRef}
            className="relative inline-block"
            onMouseEnter={showPopover}
            onMouseLeave={hidePopover}
        >
            <div className="cursor-pointer flex items-center">
                {children}
            </div>
            
            <div 
                className={cn(
                    "absolute z-[100] min-w-max rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] bg-white text-black border border-gray-100 pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                    positionClasses[placement],
                    isVisible 
                        ? "opacity-100 scale-100 translate-y-0" 
                        : "opacity-0 scale-50 translate-y-[-10px] pointer-events-none"
                )}
                onMouseEnter={showPopover}
                onMouseLeave={hidePopover}
            >
                <div className="relative z-10 overflow-hidden rounded-xl">
                    {content}
                </div>

                <div className="absolute w-3 h-3 bg-white transform rotate-45 border-l border-t border-gray-100 shadow-[-2px_-2px_5px_rgba(0,0,0,0.02)]"
                    style={{
                        left: placement === 'bottomLeft' ? '14px' : placement === 'top' ? 'calc(50% - 6px)' : 'auto',
                        right: placement === 'bottomRight' ? '14px' : 'auto',
                        top: placement.startsWith('bottom') ? '-6px' : 'auto',
                        bottom: placement.startsWith('top') ? '-6px' : 'auto',
                        zIndex: 5
                    }}
                />
            </div>
        </div>
    );
};