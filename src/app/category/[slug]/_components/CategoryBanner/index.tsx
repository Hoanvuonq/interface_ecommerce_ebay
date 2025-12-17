'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { homepageService } from '@/app/(home)/services/homepage.service';
import { BannerResponseDTO } from '@/app/(home)/_types/banner.dto';
import { toPublicUrl } from '@/utils/storage/url';
import { toSizedVariant } from '@/utils/products/media.helpers';
import { CustomSpinner } from "@/components";

interface CategoryBannerProps {
    categorySlug: string;
    categoryId?: string;
    className?: string;
}

export default function CategoryBanner({ categorySlug, categoryId, className = '' }: CategoryBannerProps) {
    const [banners, setBanners] = useState<BannerResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            if (!categoryId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await homepageService.getCategoryBanners(categoryId, 'CATEGORY_PAGE_TOP');
                const data = response?.data || [];
                setBanners(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching category banners:', error);
                setBanners([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, [categoryId]);

    if (loading) {
        return (
            <div className={`mb-4 flex justify-center items-center h-32 bg-gray-100 rounded-2xl ${className}`}>
                <CustomSpinner />
            </div>
        );
    }

    if (!banners || banners.length === 0) return null;

    const banner = banners[0];

    // Build image URL
    const getImageUrl = (basePath?: string, extension?: string) => {
        if (!basePath || !extension) return null;
        const ext = extension.startsWith('.') ? extension : `.${extension}`;
        const rawPath = `${basePath}${ext}`;
        const sizedPath = toSizedVariant(rawPath, '_orig');
        return toPublicUrl(sizedPath);
    };

    const imageUrl = getImageUrl(banner.basePath, banner.extension);

    return (
        <div className={`mb-4 ${className}`}>
            <Link
                href={banner.href || '#'}
                className="group relative block overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl banner-hover-effect"
            >
                <div className="relative aspect-[16/5] w-full overflow-hidden bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={banner.title || 'Category Banner'}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                        />
                    ) : (
                        // Fallback gradient banner with text
                        <div className="absolute inset-0 flex items-center justify-center px-8">
                            <div className="text-center text-white">
                                <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight drop-shadow-lg">
                                    {banner.title || 'Khuyến mãi đặc biệt'}
                                </h2>
                                {banner.subtitle && (
                                    <p className="mt-3 text-lg md:text-xl font-semibold text-yellow-100 drop-shadow-md">
                                        {banner.subtitle}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );
}
