'use client';

import React from 'react';
import { Sparkles, Flame, Percent, Star, LucideIcon } from 'lucide-react';
import { cn } from "@/utils/cn";

interface AnimatedBadgeProps {
    type?: 'new' | 'hot' | 'sale' | 'featured';
    text?: string;
    animation?: 'pulse' | 'glow' | 'bounce' | 'none';
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

const AnimatedBadge: React.FC<AnimatedBadgeProps> = ({
    type = 'new',
    text,
    animation = 'glow', 
    size = 'medium',
    className = '',
}) => {
    const typeConfig: Record<string, { bg: string, icon: LucideIcon, defaultText: string, accent: string }> = {
        new: {
            bg: 'bg-orange-500',
            accent: 'shadow-orange-500/40',
            icon: Sparkles,
            defaultText: 'NEW',
        },
        hot: {
            bg: 'bg-red-600',
            accent: 'shadow-red-600/40',
            icon: Flame,
            defaultText: 'HOT',
        },
        sale: {
            bg: 'bg-slate-900', 
            accent: 'shadow-slate-900/40',
            icon: Percent,
            defaultText: 'OFFER',
        },
        featured: {
            bg: 'bg-amber-500',
            accent: 'shadow-amber-500/40',
            icon: Star,
            defaultText: 'TOP',
        },
    };

    const sizeConfig = {
        small: {
            padding: 'px-2 py-0.5',
            text: 'text-[9px]',
            iconSize: 10,
        },
        medium: {
            padding: 'px-3 py-1',
            text: 'text-[10px]',
            iconSize: 12,
        },
        large: {
            padding: 'px-4 py-1.5',
            text: 'text-xs',
            iconSize: 14,
        },
    };

    const animationConfig = {
        pulse: 'animate-pulse',
        glow: 'animate-pulse shadow-lg',
        bounce: 'animate-bounce',
        none: '',
    };

    const config = typeConfig[type];
    const sizeStyle = sizeConfig[size];
    const Icon = config.icon;

    return (
        <div
            className={cn(
                "inline-flex items-center gap-1 uppercase italic transition-all duration-500",
                "rounded-full font-semibold tracking-tighter text-white border border-white/20",
                config.bg,
                config.accent,
                sizeStyle.padding,
                sizeStyle.text,
                animationConfig[animation],
                "shadow-[0_4px_12px_0_rgba(0,0,0,0.1)]",
                className
            )}
        >
            <Icon size={sizeStyle.iconSize} strokeWidth={3} className="shrink-0" />
            <span className="leading-none mt-px">{text || config.defaultText}</span>
        </div>
    );
};

export default AnimatedBadge;