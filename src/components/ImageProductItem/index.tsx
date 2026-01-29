"use client";

import React, { useState, useMemo } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/utils/cn";
import { getStandardizedKey, ICON_BG_COLORS } from "@/app/(main)/(home)/_types/categories";

const STORAGE_BASE_URL = "https://pub-5341c10461574a539df355b9fbe87197.r2.dev/";

const SIZE_PRESETS = {
  xs: { width: 40, height: 40, suffix: "thumb" },
  sm: { width: 64, height: 64, suffix: "thumb" },
  md: { width: 150, height: 150, suffix: "medium" },
  lg: { width: 300, height: 300, suffix: "_orig" }, 
};

interface ImageProductItemProps extends Omit<ImageProps, "src" | "alt"> {
  imagePath?: string | null;
  productName?: string;
  alt?: string;
  size?: keyof typeof SIZE_PRESETS;
  fallbackClassName?: string;
}

export const ImageProductItem: React.FC<ImageProductItemProps> = ({
  imagePath,
  productName = "",
  alt,
  size = "sm",
  className,
  fallbackClassName,
  ...props
}) => {
  const [imgError, setImgError] = useState(false);
  const preset = SIZE_PRESETS[size];

  const imageUrl = useMemo(() => {
    if (!imagePath) return null;
    let cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
    return `${STORAGE_BASE_URL}${cleanPath.replace("*", preset.suffix)}`;
  }, [imagePath, preset.suffix]);

  const categoryKey = getStandardizedKey(productName);
  const categoryUI = ICON_BG_COLORS[categoryKey] || ICON_BG_COLORS["default"];

  if (imageUrl && !imgError) {
    return (
      <Image
        src={imageUrl}
        alt={alt || productName}
        width={props.fill ? undefined : (props.width || preset.width)}
        height={props.fill ? undefined : (props.height || preset.height)}
        className={cn("object-cover transition-transform group-hover:scale-110 duration-500", className)}
        onError={() => setImgError(true)}
        {...props}
      />
    );
  }

  return (
    <div className={cn("w-full h-full flex items-center justify-center bg-gray-50 relative overflow-hidden", categoryUI.bg, fallbackClassName || className)}>
      <div className="relative w-1/2 h-1/2">
        <Image src="/icon/package.png" alt="Placeholder" fill className="object-contain" />
      </div>
    </div>
  );
};