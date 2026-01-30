export interface BannerItem {
  id: string | number;
  title?: string | null;
  subtitle?: string | null;
  href?: string | null;

  //
  imagePath: string;
  imagePathDesktop?: string | null;
  imagePathMobile?: string | null;

  imageAssetId?: string | null;
  imageAssetIdDesktop?: string | null;
  imageAssetIdMobile?: string | null;

  active?: boolean;
  priority?: number;
  position?: number;
  displayLocation?: string;
}

export interface CustomCarouselProps {
  banners: BannerItem[];
  autoplaySpeed?: number;
  className?: string;
  isMobile?: boolean;
}
