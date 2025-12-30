'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useHomepageContext } from '../../_context/HomepageContext';
import { resolveBannerImageUrl } from '@/utils/products/media.helpers';
import { SectionLoading } from '@/components';
import { BannerSidebarProps } from './type';

const BannerSidebar: React.FC<BannerSidebarProps> = ({ className = '' }) => {
  const { banners, isLoading } = useHomepageContext(); 
  
  const sidebarBanners = banners?.sidebar || []; 
  const banner = sidebarBanners.find((b: any) => b.active);

  if (isLoading && sidebarBanners.length === 0) {
    return <SectionLoading message='Đang tải banner...' />; 
  }

  if (!banner) return null;

  const imageUrl = banner.basePathDesktop && banner.extensionDesktop
    ? resolveBannerImageUrl(banner.basePathDesktop, banner.extensionDesktop, '_orig')
    : banner.basePath && banner.extension
    ? resolveBannerImageUrl(banner.basePath, banner.extension, '_orig')
    : null;

  if (!imageUrl) {
    console.warn('Banner Sidebar thiếu URL ảnh hợp lệ:', banner.id);
    return null;
  }

  const content = (
    <div className={`relative w-full overflow-hidden rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 group ${className}`}>
      <div className="relative w-full aspect-2/3 min-h-75 lg:min-h-112.5">
        <Image
          src={imageUrl}
          alt={banner.title || 'Quảng cáo'}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 1024px) 100vw, 25vw"
          priority 
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {banner.subtitle && (
          <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10">
            <p className="text-white text-xs font-bold uppercase tracking-widest bg-orange-500/90 py-1 px-3 rounded-full w-fit">
              Khám phá ngay
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return banner.href ? (
    <Link href={banner.href} className="block h-full outline-none focus:ring-2 focus:ring-orange-500 rounded-3xl">
      {content}
    </Link>
  ) : content;
};

export default BannerSidebar;