import { toSizedVariant } from "@/utils/products/media.helpers";
import { toPublicUrl } from "@/utils/storage/url";

export const resolveOrderItemImageUrl = (
  basePath: string | null | undefined,
  extension: string | null | undefined,
  size: '_thumb' | '_medium' | '_large' | '_orig' = '_thumb'
): string => {
  if (basePath && extension) {
    const rawPath = `${basePath}${extension}`;
    const sizedPath = toSizedVariant(rawPath, size);
    return toPublicUrl(sizedPath);
  }
  return '';
};


export interface CustomerShopChatProps {
  open: boolean;
  onClose: () => void;
  height?: number;
  targetShopId?: string;
  targetShopName?: string;
}
