/**
 * Product Media Helper Functions
 * 
 * Centralized utilities for resolving media URLs with proper variants
 * - Handles images: _thumb, _medium, _large, _orig
 * - Handles videos: original only
 * - Handles webp: _orig only
 */

import { toPublicUrl } from "../storage/url";
/**
 * Convert a path to sized variant
 * 
 * @param path - Original path
 * @param size - Variant size (_thumb, _medium, _large, _orig)
 * @returns Path with size suffix added
 */
export const toSizedVariant = (
  path?: string | null,
  size: "_thumb" | "_medium" | "_large" | "_orig" = "_large"
): string => {
  if (!path) return "";

  // Videos don't have variants
  const isVideo =
    path.includes("/videos/") ||
    path.endsWith(".mp4") ||
    path.endsWith(".mov") ||
    path.endsWith(".webm");
  if (isVideo) return path;

  // WebP only has _orig variant - check WebP first
  const lowerPath = path.toLowerCase();
  const isWebp = lowerPath.endsWith(".webp");
  const hasSizeSuffix = /_(orig|thumb|medium|large)(\.[a-zA-Z0-9]+)$/i.test(path);

  // WebP: Always use _orig, ignore size parameter
  if (isWebp) {
    if (hasSizeSuffix) {
      // Already has size suffix - ensure it's _orig
      if (path.includes("_orig")) return path;
      // Replace any other suffix with _orig
      return path.replace(/_(orig|thumb|medium|large)(\.webp)$/i, `_orig$2`);
    }
    // No size suffix - add _orig
    return path.replace(/(\.webp)$/i, `_orig$1`);
  }

  // Non-WebP: Use provided size
  if (hasSizeSuffix) {
    return path.replace(/_(orig|thumb|medium|large)(\.[a-zA-Z0-9]+)$/i, `${size}$2`);
  }

  return path.replace(/(\.[a-zA-Z0-9]+)$/i, `${size}$1`);
};

/**
 * Resolve media URL to public CDN URL with proper variant
 * 
 * @param media - Media object with url/basePath/extension
 * @param size - Variant size
 * @returns Full public CDN URL
 */
export const resolveMediaUrl = (
  media: any,
  size: "_thumb" | "_medium" | "_large" | "_orig" = "_large"
): string => {
  if (!media) return "";

  const isVideo =
    media.type === "VIDEO" ||
    media.url?.includes("/videos/") ||
    media.url?.endsWith(".mp4") ||
    media.url?.endsWith(".mov") ||
    media.url?.endsWith(".webm");

  const extension =
    media.extension ||
    (media.url ? media.url.match(/\.([a-zA-Z0-9]+)$/i)?.[0] : null);
  const isWebp =
    extension &&
    (extension.toLowerCase().endsWith(".webp") ||
      extension.toLowerCase() === "webp");

  let raw = "";
  if (media.url) {
    if (isVideo) {
      raw = media.url;
    } else if (isWebp) {
      raw = toSizedVariant(media.url, "_orig");
    } else {
      raw = toSizedVariant(media.url, size);
    }
  } else if (media.basePath && media.extension) {
    if (isVideo) {
      raw = `${media.basePath}${media.extension}`;
    } else if (isWebp) {
      raw = `${media.basePath}_orig${media.extension}`;
    } else {
      raw = `${media.basePath}${size}${media.extension}`;
    }
  }

  return toPublicUrl(raw || "");
};

/**
 * Resolve variant image URL to public CDN URL
 * 
 * @param variant - Product variant with imageUrl/imageBasePath/imageExtension
 * @param size - Variant size
 * @returns Full public CDN URL
 */
export const resolveVariantImageUrl = (
  variant: any,
  size: "_thumb" | "_medium" | "_large" | "_orig" = "_thumb"
): string => {
  if (!variant) return "";

  // Get extension and normalize it (ensure it starts with a dot)
  let extension = variant.imageExtension;
  if (!extension && variant.imageUrl) {
    const match = variant.imageUrl.match(/\.([a-zA-Z0-9]+)$/i);
    extension = match ? `.${match[1]}` : null;
  }
  
  // Normalize extension: ensure it starts with a dot
  if (extension && !extension.startsWith('.')) {
    extension = `.${extension}`;
  }

  // Check if WebP (extension should be normalized to .webp at this point)
  const isWebp = extension && extension.toLowerCase() === ".webp";

  let raw = "";
  if (variant.imageUrl) {
    raw = isWebp
      ? toSizedVariant(variant.imageUrl, "_orig")
      : toSizedVariant(variant.imageUrl, size);
  } else if (variant.imageBasePath && variant.imageExtension) {
    // Ensure extension is normalized
    const normalizedExtension = variant.imageExtension.startsWith('.') 
      ? variant.imageExtension 
      : `.${variant.imageExtension}`;
    
    raw = isWebp
      ? `${variant.imageBasePath}_orig${normalizedExtension}`
      : `${variant.imageBasePath}${size}${normalizedExtension}`;
  }

  return toPublicUrl(raw || "");
};

/**
 * Resolve banner image URL from basePath and extension to public CDN URL
 * 
 * @param basePath - Base path of the banner image
 * @param extension - Extension of the banner image (with or without leading dot)
 * @param size - Variant size (default: _orig for banners)
 * @returns Full public CDN URL
 */
export const resolveBannerImageUrl = (
  basePath?: string | null,
  extension?: string | null,
  size: "_thumb" | "_medium" | "_large" | "_orig" = "_orig"
): string => {
  if (!basePath || !extension) return "";

  // Normalize extension (ensure it starts with dot)
  const normalizedExtension = extension.startsWith('.') ? extension : `.${extension}`;
  
  // Build raw path
  const rawPath = `${basePath}${normalizedExtension}`;
  
  // Use toSizedVariant to handle WebP and other formats correctly
  const sizedPath = toSizedVariant(rawPath, size);
  
  return toPublicUrl(sizedPath);
};

/**
 * Get original media URL for API (without variants)
 * 
 * @param media - Media object
 * @returns Original URL for API calls
 */
export const getOriginalMediaUrl = (media: any): string => {
  if (!media) return "";
  
  if (media.url) {
    return media.url;
  }
  
  if (media.basePath && media.extension) {
    // For API, we use _orig variant
    return `${media.basePath}_orig${media.extension}`;
  }
  
  return "";
};

