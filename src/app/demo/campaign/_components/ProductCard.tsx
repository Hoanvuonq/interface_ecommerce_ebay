'use client';

import { Clock, Tag, ShoppingCart, TrendingUp } from 'lucide-react';
import type { CampaignSlotProductResponse } from '../types';

interface ProductCardProps {
    product: CampaignSlotProductResponse;
    onAddToCart?: (product: CampaignSlotProductResponse) => void;
}

/**
 * Flash Sale Product Card
 * Vibrant design with discount badge, progress bar, and CTA
 */
export function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const progressPercent = Math.round((product.stockSold / product.stockLimit) * 100);
    const isLowStock = product.stockRemaining <= 5 && product.stockRemaining > 0;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    return (
        <div className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer">
            {/* Discount Badge */}
            <div className="absolute top-3 left-0 z-10">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-r-full font-bold text-sm shadow-lg flex items-center gap-1">
                    <Tag size={14} />
                    -{product.discountPercent}%
                </div>
            </div>

            {/* Sold Out Overlay */}
            {product.isSoldOut && (
                <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center">
                    <span className="bg-gray-900 text-white px-6 py-3 rounded-full font-bold text-xl">
                        HẾT HÀNG
                    </span>
                </div>
            )}

            {/* Low Stock Badge */}
            {isLowStock && !product.isSoldOut && (
                <div className="absolute top-3 right-3 z-10">
                    <div className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 animate-pulse">
                        <TrendingUp size={12} />
                        Sắp hết
                    </div>
                </div>
            )}

            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                    src={product.productThumbnail || 'https://picsum.photos/400/400'}
                    alt={product.productName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Shop Name */}
                <p className="text-xs text-gray-500 mb-1 truncate">{product.shopName}</p>

                {/* Product Name */}
                <h3 className="font-semibold text-gray-900 line-clamp-2 h-12 mb-3">
                    {product.productName}
                </h3>

                {/* Pricing */}
                <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-bold text-red-500">
                        {formatPrice(product.salePrice)}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                    </span>
                </div>

                {/* Stock Progress */}
                <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span className="flex items-center gap-1">
                            <Clock size={12} />
                            Đã bán {product.stockSold}
                        </span>
                        <span>Còn {product.stockRemaining}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${progressPercent >= 80
                                    ? 'bg-gradient-to-r from-red-500 to-orange-500'
                                    : progressPercent >= 50
                                        ? 'bg-gradient-to-r from-amber-400 to-orange-400'
                                        : 'bg-gradient-to-r from-blue-500 to-blue-600'
                                }`}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                {/* CTA Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart?.(product);
                    }}
                    disabled={product.isSoldOut}
                    className={`
            w-full py-3 rounded-xl font-semibold text-sm
            flex items-center justify-center gap-2
            transition-all duration-200
            ${product.isSoldOut
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 active:scale-95 shadow-lg shadow-orange-500/30'
                        }
          `}
                >
                    <ShoppingCart size={18} />
                    {product.isSoldOut ? 'Hết hàng' : 'Mua ngay'}
                </button>

                {/* Limit Badge */}
                {product.purchaseLimitPerUser && product.purchaseLimitPerUser > 0 && (
                    <p className="text-center text-xs text-gray-400 mt-2">
                        Giới hạn {product.purchaseLimitPerUser} sản phẩm/người
                    </p>
                )}
            </div>
        </div>
    );
}
