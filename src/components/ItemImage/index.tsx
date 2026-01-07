"use client";

import React, { useState } from "react";
import { Package, ImageOff } from "lucide-react";
import { resolvePreviewItemImageUrl } from "@/utils/cart/image.utils";
import { cn } from "@/utils/cn";
import Image from "next/image";

interface ItemImageProps {
  item: {
    basePath?: string;
    extension?: string;
    productName?: string;
  };
  className?: string;
}

export const ItemImage: React.FC<ItemImageProps> = ({
  item,
  className = "w-16 h-16 rounded-lg border",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const imageUrl = resolvePreviewItemImageUrl(
    item.basePath,
    item.extension,
    "_thumb"
  );

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
        alt={item.productName || "Product Image"}
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
