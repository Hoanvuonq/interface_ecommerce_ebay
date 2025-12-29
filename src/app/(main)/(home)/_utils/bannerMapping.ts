
import { GRADIENT_PRESETS } from "@/constants/section";
import { BannerResponseDTO } from "../_types/banner.dto";
import { resolveBannerImageUrl } from "@/utils/products/media.helpers";
import { IBannerSection } from "../_types/section"; 

const DEFAULT_BANNER_IMAGE = "/images/hero/default-banner.jpg";

/**
 * Ánh xạ (map) dữ liệu banner thô (DTO) nhận được từ API sang định dạng hiển thị (Display Data).
 * Gán các lớp gradient preset và xử lý đường dẫn ảnh.
 *
 * @param banner Dữ liệu Banner thô từ API
 * @param index Index của banner trong mảng (dùng để chọn gradient preset)
 * @returns Dữ liệu Banner đã định dạng để hiển thị
 */
export const mapBannerToDisplay = (
  banner: BannerResponseDTO,
  index: number
): IBannerSection => {
  const preset = GRADIENT_PRESETS[index % GRADIENT_PRESETS.length];

  // Build image URLs
  let imageUrl: string | undefined;
  let imageUrlDesktop: string | undefined;
  let imageUrlMobile: string | undefined;

  // Legacy/Fallback
  if (banner.basePath && banner.extension) {
    imageUrl = resolveBannerImageUrl(
      banner.basePath,
      banner.extension,
      "_orig"
    );
  }

  // Desktop
  if (banner.basePathDesktop && banner.extensionDesktop) {
    imageUrlDesktop = resolveBannerImageUrl(
      banner.basePathDesktop,
      banner.extensionDesktop,
      "_orig"
    );
  }

  // Mobile
  if (banner.basePathMobile && banner.extensionMobile) {
    imageUrlMobile = resolveBannerImageUrl(
      banner.basePathMobile,
      banner.extensionMobile,
      "_orig"
    );
  }

  const subtitleParts = banner.subtitle?.split("\n") || [];
  const description = subtitleParts[0] || banner.subtitle || "";
  const description2 = subtitleParts[1] || "";

  return {
    id: banner.id,
    title: banner.title || "Khuyến mãi đặc biệt",
    description,
    description2,
    href: banner.href || "/products",
    imageUrl,
    imageUrlDesktop,
    imageUrlMobile,
    ...preset,
  };
};