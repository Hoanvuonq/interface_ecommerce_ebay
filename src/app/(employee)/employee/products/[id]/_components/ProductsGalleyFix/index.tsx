import React, { useState, useEffect, useRef } from "react";
import { ProductMediaResponse } from "../../../_types/dto/product.dto";
import { resolveMediaUrl } from "@/utils/products/media.helpers";
import { Play, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
    media: ProductMediaResponse[];
    productName?: string;
}

export default function ProductsGalleyFix ({ media, productName }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (media && media.length > 0) {
            setSelectedIndex(0);
        }
    }, [media]);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200;
            scrollContainerRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    if (!media || media.length === 0) {
        return (
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                <span className="text-gray-400 font-medium">No media available</span>
            </div>
        );
    }

    const selectedItem = media[selectedIndex];
    // Check if item is video based on type or extension
    const isVideo = selectedItem.type === "VIDEO" ||
        selectedItem.url?.toLowerCase().endsWith(".mp4") ||
        selectedItem.url?.toLowerCase().endsWith(".mov") ||
        selectedItem.url?.toLowerCase().endsWith(".webm");

    const mediaUrl = resolveMediaUrl(selectedItem, "_large");

    return (
        <div className="space-y-4">
            {/* Main Media Display */}
            <div className="aspect-square rounded-xl border-2 border-green-500 overflow-hidden bg-white relative shadow-sm flex items-center justify-center group">
                {isVideo ? (
                    <video
                        src={mediaUrl}
                        controls
                        className="w-full h-full object-contain"
                        poster={resolveMediaUrl(selectedItem, "_thumb")}
                    />
                ) : (
                    <img
                        src={mediaUrl}
                        alt={productName}
                        className="w-full h-full object-contain p-2"
                    />
                )}
            </div>

            {/* Thumbnails Strip */}
            <div className="relative group/thumbs">
                {/* Navigation Buttons - Show only if content overflows or media length > 4 */}
                {media.length > 4 && (
                    <>
                        <button
                            onClick={() => scroll("left")}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 bg-white shadow-md rounded-full p-2 text-gray-600 opacity-0 group-hover/thumbs:opacity-100 transition-all hover:text-green-600 hover:scale-110 border border-gray-100"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 bg-white shadow-md rounded-full p-2 text-gray-600 opacity-0 group-hover/thumbs:opacity-100 transition-all hover:text-green-600 hover:scale-110 border border-gray-100"
                            aria-label="Scroll right"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </>
                )}

                {/* Scrollable Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x px-1"
                    style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        scrollBehavior: "smooth"
                    }}
                >
                    {media.map((item, index) => {
                        const isItemVideo = item.type === "VIDEO" ||
                            item.url?.toLowerCase().endsWith(".mp4") ||
                            item.url?.toLowerCase().endsWith(".mov");
                        const isSelected = selectedIndex === index;

                        return (
                            <button
                                key={item.id || index}
                                onClick={() => setSelectedIndex(index)}
                                className={`relative flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden bg-white transition-all snap-start ${isSelected
                                        ? "border-green-500 ring-2 ring-green-100 shadow-sm scale-105 z-10"
                                        : "border-transparent hover:border-gray-300 opacity-80 hover:opacity-100"
                                    }`}
                            >
                                <img
                                    src={resolveMediaUrl(item, "_thumb")}
                                    alt={`${productName} ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />

                                {/* Type Indicator Icon */}
                                <div className="absolute bottom-1 right-1 bg-black/60 rounded-full p-1 text-white backdrop-blur-sm">
                                    {isItemVideo ? (
                                        <Play size={10} fill="currentColor" />
                                    ) : (
                                        <ImageIcon size={10} />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
