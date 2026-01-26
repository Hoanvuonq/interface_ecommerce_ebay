
import { toPublicUrl } from "../storage/url";
import { toSizedVariant } from "../products/media.helpers";

export const resolveCartItemImageUrl = (
  item: {
    imageBasePath?: string | null;
    imageExtension?: string | null;
    thumbnailUrl?: string;
  },
  size: "_thumb" | "_medium" | "_large" | "_orig" = "_thumb",
): string => {
  if (item.imageBasePath && item.imageExtension) {
    const raw = `${item.imageBasePath}${size}${item.imageExtension}`;
    return toPublicUrl(raw);
  }
  if (item.thumbnailUrl) {
    const raw = toSizedVariant(item.thumbnailUrl, size);
    return toPublicUrl(raw || "");
  }
  return "";
};

export const resolvePreviewItemImageUrl = (
  basePath: string | null | undefined,
  extension: string | null | undefined,
  size: "_thumb" | "_medium" | "_large" | "_orig" = "_thumb",
): string => {
  if (!basePath) return "";

  if (extension) {
    const raw = `${basePath}${size}${extension}`;
    return toPublicUrl(raw);
  }

  const extensionMatch = basePath.match(
    /(_orig|_thumb|_medium|_large)?(\.[a-zA-Z0-9]+)$/,
  );
  if (extensionMatch) {
    const [fullMatch, existingSize, ext] = extensionMatch;
    const baseWithoutSizeAndExt = basePath.replace(fullMatch, "");
    const raw = `${baseWithoutSizeAndExt}${size}${ext}`;
    return toPublicUrl(raw);
  }

  const simpleExtMatch = basePath.match(/(\.[a-zA-Z0-9]+)$/);
  if (simpleExtMatch) {
    const ext = simpleExtMatch[1];
    const baseWithoutExt = basePath.replace(ext, "");
    const raw = `${baseWithoutExt}${size}${ext}`;
    return toPublicUrl(raw);
  }

  return "";
};
