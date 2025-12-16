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

