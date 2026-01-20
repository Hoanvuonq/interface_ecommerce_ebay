/**
 * Cart Image Utilities - Helper functions for resolving cart item images
 */

import { toPublicUrl } from "../storage/url";
import { toSizedVariant } from "../products/media.helpers";
/**
 * Resolve image URL for cart item
 * Priority: imageBasePath + imageExtension > thumbnailUrl
 * @param item Cart item with image properties
 * @param size Image size variant (_thumb, _medium, _large, _orig)
 * @returns Resolved public URL or empty string
 */
export const resolveCartItemImageUrl = (
    item: { imageBasePath?: string | null; imageExtension?: string | null; thumbnailUrl?: string },
    size: '_thumb' | '_medium' | '_large' | '_orig' = '_thumb'
): string => {
    // Priority 1: Use imageBasePath + imageExtension (new format)
    if (item.imageBasePath && item.imageExtension) {
        const raw = `${item.imageBasePath}${size}${item.imageExtension}`;
        return toPublicUrl(raw);
    }
    // Priority 2: Use thumbnailUrl if available (legacy format)
    if (item.thumbnailUrl) {
        const raw = toSizedVariant(item.thumbnailUrl, size);
        return toPublicUrl(raw || '');
    }
    return '';
};

export const resolvePreviewItemImageUrl = (
  basePath: string | null | undefined,
  extension: string | null | undefined,
  size: '_thumb' | '_medium' | '_large' | '_orig' = '_thumb'
): string => {
  if (!basePath) return '';
  
  // Case 1: basePath + extension provided separately
  if (extension) {
    const raw = `${basePath}${size}${extension}`;
    return toPublicUrl(raw);
  }
  
  // Case 2: basePath already contains full path with extension (e.g., "path/file_orig.jpg")
  // Extract extension from basePath and reconstruct with requested size
  const extensionMatch = basePath.match(/(_orig|_thumb|_medium|_large)?(\.[a-zA-Z0-9]+)$/);
  if (extensionMatch) {
    const [fullMatch, existingSize, ext] = extensionMatch;
    // Remove existing size suffix and extension, then add requested size + extension
    const baseWithoutSizeAndExt = basePath.replace(fullMatch, '');
    const raw = `${baseWithoutSizeAndExt}${size}${ext}`;
    return toPublicUrl(raw);
  }
  
  // Case 3: basePath has extension but no size suffix (e.g., "path/file.jpg")
  const simpleExtMatch = basePath.match(/(\.[a-zA-Z0-9]+)$/);
  if (simpleExtMatch) {
    const ext = simpleExtMatch[1];
    const baseWithoutExt = basePath.replace(ext, '');
    const raw = `${baseWithoutExt}${size}${ext}`;
    return toPublicUrl(raw);
  }
  
  return '';
};

