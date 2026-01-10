export interface BannerItem {
  id: string | number;
  href: string;
  imageUrl?: string;
  imageUrlDesktop?: string;
  imageUrlMobile?: string;
  title?: string;
}

export interface CustomCarouselProps {
  banners: BannerItem[];
  autoplaySpeed?: number;
  className?: string;
  isMobile?: boolean;
}
