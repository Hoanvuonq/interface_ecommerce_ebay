"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface BannerItem {
    id: string | number;
    href: string;
    imageUrl?: string;
    imageUrlDesktop?: string;
    imageUrlMobile?: string;
    title?: string;
}

interface CustomCarouselProps {
    banners: BannerItem[];
    autoplaySpeed?: number;
    className?: string; // Class cho container (ví dụ: h-[260px])
    isMobile?: boolean; // Dùng để chọn ảnh mobile/desktop
}

const DEFAULT_BANNER_IMAGE = "/images/hero/default-banner.jpg";

export const CustomCarousel: React.FC<CustomCarouselProps> = ({
    banners,
    autoplaySpeed = 4500,
    className = 'h-full',
    isMobile = false,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    if (banners.length === 0) return null;

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    useEffect(() => {
        const nextSlide = () => {
            setCurrentIndex((prevIndex) => 
                prevIndex === banners.length - 1 ? 0 : prevIndex + 1
            );
        };

        resetTimeout();
        timeoutRef.current = setTimeout(nextSlide, autoplaySpeed);

        return () => {
            resetTimeout();
        };
    }, [currentIndex, banners.length, autoplaySpeed]);


    const prev = () => {
        resetTimeout();
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? banners.length - 1 : prevIndex - 1
        );
    };

    const next = () => {
        resetTimeout();
        setCurrentIndex((prevIndex) => 
            prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        );
    };

    // Lấy URL ảnh phù hợp
    const getImageUrl = (banner: BannerItem) => {
        if (isMobile) return banner.imageUrlMobile || banner.imageUrl || DEFAULT_BANNER_IMAGE;
        return banner.imageUrlDesktop || banner.imageUrl || DEFAULT_BANNER_IMAGE;
    };
    
    // Nếu chỉ có 1 banner, không cần controls và dots
    const hasMultipleSlides = banners.length > 1;

    return (
        <div 
            className={cn("relative w-full overflow-hidden", className)}
            onMouseEnter={resetTimeout} // Tạm dừng autoplay khi hover
            onMouseLeave={() => {
                resetTimeout();
                timeoutRef.current = setTimeout(next, autoplaySpeed); // Khởi động lại
            }}
        >
            {/* Thanh trượt chính (Container) */}
            <div 
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {banners.map((banner) => (
                    <div 
                        key={banner.id} 
                        className="w-full shrink-0 h-full"
                    >
                        <Link href={banner.href} className="block h-full">
                            <img
                                src={getImageUrl(banner)}
                                alt={banner.title || "Banner"}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </Link>
                    </div>
                ))}
            </div>

            {/* Nút Điều hướng (Arrows) */}
            {hasMultipleSlides && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                        aria-label="Slide trước"
                    >
                        <ChevronLeft className="text-gray-700 w-5 h-5" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                        aria-label="Slide tiếp theo"
                    >
                        <ChevronRight className="text-gray-700 w-5 h-5" />
                    </button>
                </>
            )}

            {/* Dots (Chấm tròn chỉ báo) */}
            {hasMultipleSlides && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                resetTimeout();
                                setCurrentIndex(index);
                            }}
                            className={cn(
                                "h-2 transition-all duration-300",
                                // Style tương đương Ant Design custom dots
                                "bg-white/50 border-2 border-white/80 rounded-full",
                                index === currentIndex ? "w-8 bg-orange-500 border-orange-500" : "w-2"
                            )}
                            aria-label={`Đi tới slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};