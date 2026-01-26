import { toPublicUrl } from "../storage/url";

export const getCleanUrl = (
  url: string | null | undefined,
  fallback = "/placeholder-product.png",
) => {
  if (!url || url.trim() === "") return fallback;
  let clean = url.trim();
  if (clean.startsWith("public/")) clean = clean.replace("public/", "/");
  if (!clean.startsWith("http") && !clean.startsWith("/")) clean = `/${clean}`;
  return clean;
};

export const toSizedVariant = (
  path?: string | null,
  size: "_thumb" | "_medium" | "_large" | "_orig" = "_large",
): string => {
  if (!path) return "";

  const isVideo =
    path.includes("/videos/") ||
    path.endsWith(".mp4") ||
    path.endsWith(".mov") ||
    path.endsWith(".webm");
  if (isVideo) return path;

  const lowerPath = path.toLowerCase();
  const isWebp = lowerPath.endsWith(".webp");
  const hasSizeSuffix = /_(orig|thumb|medium|large)(\.[a-zA-Z0-9]+)$/i.test(
    path,
  );

  if (isWebp) {
    if (hasSizeSuffix) {
      if (path.includes("_orig")) return path;
      return path.replace(/_(orig|thumb|medium|large)(\.webp)$/i, `_orig$2`);
    }
    return path.replace(/(\.webp)$/i, `_orig$1`);
  }

  if (hasSizeSuffix) {
    return path.replace(
      /_(orig|thumb|medium|large)(\.[a-zA-Z0-9]+)$/i,
      `${size}$2`,
    );
  }

  return path.replace(/(\.[a-zA-Z0-9]+)$/i, `${size}$1`);
};

export const resolveMediaUrl = (
  media: any,
  size: "_thumb" | "_medium" | "_large" | "_orig" = "_large",
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

export const resolveVariantImageUrl = (
  variant: any,
  size: "_thumb" | "_medium" | "_large" | "_orig" = "_thumb",
): string => {
  if (!variant) return "";

  let extension = variant.imageExtension;
  if (!extension && variant.imageUrl) {
    const match = variant.imageUrl.match(/\.([a-zA-Z0-9]+)$/i);
    extension = match ? `.${match[1]}` : null;
  }

  if (extension && !extension.startsWith(".")) {
    extension = `.${extension}`;
  }

  const isWebp = extension && extension.toLowerCase() === ".webp";

  let raw = "";
  if (variant.imageUrl) {
    raw = isWebp
      ? toSizedVariant(variant.imageUrl, "_orig")
      : toSizedVariant(variant.imageUrl, size);
  } else if (variant.imageBasePath && variant.imageExtension) {
    const normalizedExtension = variant.imageExtension.startsWith(".")
      ? variant.imageExtension
      : `.${variant.imageExtension}`;

    raw = isWebp
      ? `${variant.imageBasePath}_orig${normalizedExtension}`
      : `${variant.imageBasePath}${size}${normalizedExtension}`;
  }

  return toPublicUrl(raw || "");
};

export const resolveBannerImageUrl = (
  basePath?: string | null,
  extension?: string | null,
  size: "_thumb" | "_medium" | "_large" | "_orig" = "_orig",
): string => {
  if (!basePath || !extension) return "";

  const normalizedExtension = extension.startsWith(".")
    ? extension
    : `.${extension}`;
  const rawPath = `${basePath}${normalizedExtension}`;
  const sizedPath = toSizedVariant(rawPath, size);

  return toPublicUrl(sizedPath);
};

export const getOriginalMediaUrl = (media: any): string => {
  if (!media) return "";

  if (media.url) {
    return media.url;
  }

  if (media.basePath && media.extension) {
    return `${media.basePath}_orig${media.extension}`;
  }

  return "";
};
