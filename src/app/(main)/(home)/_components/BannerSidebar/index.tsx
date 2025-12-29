'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useHomepageBannerContext } from '../../_context/HomepageBannerContext';
import { resolveBannerImageUrl } from '@/utils/products/media.helpers';
import { SectionLoading } from '@/components';

interface BannerSidebarProps {
    className?: string;
}

const BannerSidebar: React.FC<BannerSidebarProps> = ({ className = '' }) => {
    const { sidebarBanners, loading } = useHomepageBannerContext();
    const banner = sidebarBanners.find((b) => b.active);

    if (loading) {
        return (
            <SectionLoading message='Loading ...'/>
        );
    }

    if (!banner) {return null}

    let imageUrl: string | undefined;

    if (banner.basePathDesktop && banner.extensionDesktop) {
        imageUrl = resolveBannerImageUrl(banner.basePathDesktop, banner.extensionDesktop, '_orig');
    }
    else if (banner.basePath && banner.extension) {
        imageUrl = resolveBannerImageUrl(banner.basePath, banner.extension, '_orig');
    }

    if (!imageUrl) {
        console.error('Banner missing valid image URL:', banner);
        return null;
    }

    const content = (
        <div className={`relative w-full overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 group ${className}`}>
            <div className="relative w-full aspect-2/3 min-h-100 lg:min-h-150">
                <Image
                    src={imageUrl}
                    alt={banner.title || 'Featured Products Banner'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    priority
                />
            </div>

            <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
    );

    if (banner.href) {
        return (
            <Link href={banner.href} className="block h-full">
                {content}
            </Link>
        );
    }

    return content;
};

export default BannerSidebar;
