"use client";

import React, { useState } from "react";
import { Package, ImageOff } from "lucide-react";
import { resolvePreviewItemImageUrl } from "@/utils/cart/image.utils";
import { cn } from "@/utils/cn";
import Image from "next/image";

// Cart image URL helpers
const ABSOLUTE_PROTOCOL_REGEX = /^(?:https?:)?\/\//i;

export const getPublicBase = (): string => {
  return (
    process.env.NEXT_PUBLIC_STORAGE_PUBLIC_BASE ||
    "https://pub-5341c10461574a539df355b9fbe87197.r2.dev"
  );
};

export const toPublicUrl = (path?: string | null): string => {
  if (!path) return "";
  const normalized = String(path).trim();

  if (
    ABSOLUTE_PROTOCOL_REGEX.test(normalized) ||
    normalized.startsWith("data:") ||
    normalized.startsWith("blob:")
  ) {
    return normalized;
  }

  const base = getPublicBase().replace(/\/$/, "");
  const cleanPath = normalized.replace(/^\/+/, "");
  return `${base}/${cleanPath}`;
};

interface ItemImageProps {
  items: {
    basePath?: string;
    extension?: string;
    productName?: string;
  };
  className?: string;
}

export const ItemImage: React.FC<ItemImageProps> = ({
  items,
  className = "w-16 h-16 rounded-lg border",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Xử lý imageUrl: Nếu extension không có, ưu tiên lấy basePath gốc hoặc _orig
  let imageUrl = "";
  if (items.basePath) {
    if (items.extension) {
      imageUrl = resolvePreviewItemImageUrl(
        items.basePath,
        items.extension,
        "_thumb"
      );
    } else if (
      /_orig\.[a-zA-Z0-9]+$|_thumb\.[a-zA-Z0-9]+$|_medium\.[a-zA-Z0-9]+$|_large\.[a-zA-Z0-9]+$/.test(
        items.basePath
      )
    ) {
      imageUrl = toPublicUrl(items.basePath);
    } else {
      imageUrl = resolvePreviewItemImageUrl(items.basePath, null, "_orig");
    }
  }

  const FallbackIcon = () => (
    <div
      className={cn(
        "flex items-center justify-center bg-gray-50  transition-colors duration-300 text-(--color-mainColor)",
        className
      )}
    >
      {isError ? (
        <ImageOff size={20} strokeWidth={1.5} />
      ) : (
        <Package size={20} strokeWidth={1.5} />
      )}
    </div>
  );

  if (!imageUrl) {
    return <FallbackIcon />;
  }

  if (isError) {
    return <FallbackIcon />;
  }

  return (
    <div
      className={cn("relative overflow-hidden group bg-gray-100", className)}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse z-10" />
      )}
      <Image
        src={imageUrl}
        alt={items.productName || items.basePath || "Product Image"}
        width={64}
        height={64}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setIsError(true);
        }}
        className={cn(
          "w-full h-full object-cover transition-all duration-500 ease-in-out",
          "group-hover:scale-110",
          isLoading
            ? "scale-110 blur-sm grayscale opacity-0"
            : "scale-100 blur-0 grayscale-0 opacity-100"
        )}
      />
    </div>
  );
};
