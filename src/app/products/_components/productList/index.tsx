'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
    LayoutGrid, List, Heart, Star, ShoppingCart, Loader2, Search,
} from 'lucide-react';

import { ProductCard } from '../ProductCard';
import { publicProductService } from '@/services/products/product.service';
import { PublicProductSearchQueryDTO, PublicProductListItemDTO } from '@/types/product/public-product.dto';
import { useCart } from '../../_hooks/useCart';
import { requireAuthentication } from '@/utils/cart/cart-auth.utils';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn'; 
import { CustomButton } from '@/components/button'; 

const CustomLoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
);

const CustomSelect: React.FC<any> = ({ options, value, onChange, placeholder, className, ...rest }) => (
    <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        className={cn(
            "px-3 py-1.5 text-sm border border-gray-300 text-black cursor-pointer rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-150 h-8 bg-white appearance-none pr-8",
            className
        )}
        {...rest}
    >
        <option value="" disabled>{placeholder}</option>
        {options.map((option: any) => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ))}
    </select>
);

// Thay thế Antd Skeleton (Chỉ là lưới giả đơn giản)
const GridSkeleton: React.FC<{ count: number }> = ({ count }) => (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {Array.from({ length: count }).map((_, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md border border-gray-100 animate-pulse overflow-hidden">
                <div className="w-full aspect-square bg-gray-200"></div>
                <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="flex justify-between items-center pt-2">
                         <div className="h-4 bg-blue-200 rounded w-1/3"></div>
                         <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

// Thay thế Antd Pagination (Mô phỏng cơ bản)
const CustomPagination: React.FC<any> = ({ page, pageSize, total, onChange, showTotal }) => {
    const totalPages = Math.ceil(total / pageSize);
    const canPrev = page > 1;
    const canNext = page < totalPages;
    const startItem = (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, total);

    const handlePrev = () => {
        if (canPrev) onChange(page - 1, pageSize);
    };
    const handleNext = () => {
        if (canNext) onChange(page + 1, pageSize);
    };

    return (
        <div className="flex justify-center items-center gap-3 text-sm">
            <CustomButton
                onClick={handlePrev}
                disabled={!canPrev}
                className="!h-10 !px-4 !text-sm !rounded-lg"
            >
                Trước
            </CustomButton>

            <span className="text-gray-600 font-medium">
                {showTotal(total, [startItem, endItem])}
            </span>

            <CustomButton
                onClick={handleNext}
                disabled={!canNext}
                className="!h-10 !px-4 !text-sm !rounded-lg"
            >
                Sau
            </CustomButton>
        </div>
    );
};


// ====================================================================
// PRODUCT LIST COMPONENT
// ====================================================================

export default function ProductList({
    filters,
    endpoint = 'all',
}: {
    filters: Partial<PublicProductSearchQueryDTO>;
    endpoint?: 'all' | 'featured' | 'new' | 'promoted';
}) {
    const router = useRouter();
    const { quickAddToCart } = useCart();
    const [products, setProducts] = useState<PublicProductListItemDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [total, setTotal] = useState(0);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [addingToCart, setAddingToCart] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);

            let res: any;

            const baseParams = {
                page: page - 1,
                size: pageSize,
                keyword: filters.keyword,
                categoryId: filters.categoryId,
                categories: filters.categories,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                sort: filters.sort,
            };

            if (endpoint === 'featured') {
                res = await publicProductService.getFeatured(baseParams.page, baseParams.size);
            } else if (endpoint === 'new') {
                res = await publicProductService.getNew(baseParams.page, baseParams.size);
            } else if (endpoint === 'promoted') {
                res = await publicProductService.getPromoted(baseParams.page, baseParams.size);
            } else {
                // Endpoint 'all' or default search
                const searchParams: any = {};
                // Chỉ thêm các filter có giá trị
                Object.keys(baseParams).forEach(key => {
                    const value = baseParams[key as keyof typeof baseParams];
                    if (value !== undefined && value !== null && value !== "") {
                        searchParams[key] = value;
                    }
                });
                res = await publicProductService.search(searchParams);
            }

            const responseData = res?.data;
            if (responseData?.content !== undefined) {
                setProducts(responseData.content || []);
                setTotal(responseData.totalElements || 0);
            } else if (Array.isArray(responseData)) {
                setProducts(responseData);
                setTotal(responseData.length);
            } else {
                setProducts([]);
                setTotal(0);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            toast.error('Không thể tải danh sách sản phẩm'); // ✅ Thay thế message.error
            setProducts([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [
        endpoint,
        page,
        pageSize,
        filters.keyword,
        filters.categoryId,
        filters.categories,
        filters.minPrice,
        filters.maxPrice,
        filters.sort
    ]);

    useEffect(() => {
        setPage(1);
    }, [
        endpoint,
        filters.keyword,
        filters.categoryId,
        filters.categories,
        filters.minPrice,
        filters.maxPrice,
        filters.sort
    ]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]); // Dùng fetchProducts trong dependency array vì nó là useCallback

    const formatPrice = (price: number) => {
        const numPrice = typeof price === 'number' ? price : parseFloat(price as any) || 0;
        if (numPrice >= 1000000000) return `${(numPrice / 1000000000).toFixed(1)}B ₫`;
        if (numPrice >= 1000000) return `${(numPrice / 1000000).toFixed(1)}M ₫`;
        if (numPrice >= 1000) return `${(numPrice / 1000).toFixed(1)}K ₫`;
        
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(numPrice);
    };

    const getPrimaryImage = (media: any[]) => {
        const primaryImage = media.find((m) => m.isPrimary && m.type === 'IMAGE');
        return primaryImage?.url || media.find((m) => m.type === 'IMAGE')?.url || '/placeholder-product.jpg';
    };

    const handleAddToCart = async (product: PublicProductListItemDTO) => {
        if (!requireAuthentication(window.location.pathname)) {
            return;
        }

        setAddingToCart(product.id);

        try {
            const productDetailRes = product.slug 
                ? await publicProductService.getBySlug(product.slug)
                : await publicProductService.getById(product.id);
            
            const productDetail = productDetailRes.data;

            if (!productDetail.variants || productDetail.variants.length === 0) {
                toast.warning('Sản phẩm chưa có phiên bản để thêm vào giỏ'); // ✅ Thay thế message.warning
                router.push(`/products/${product.slug || product.id}`);
                return;
            }

            const availableVariant = productDetail.variants.find((v: any) => v.stockQuantity && v.stockQuantity > 0)
                || productDetail.variants[0];

            if (!availableVariant) {
                toast.warning('Sản phẩm hiện không có sẵn'); // ✅ Thay thế message.warning
                return;
            }

            const success = await quickAddToCart(availableVariant.id, 1);

            if (success) {
                toast.success(`Đã thêm "${product.name}" vào giỏ hàng`); // ✅ Thay thế message.success
            } else {
                throw new Error('Failed to add to cart');
            }
        } catch (error: any) {
            console.error('Error adding to cart:', error);

            if (error?.message?.includes('variant')) {
                toast.info('Vui lòng chọn phiên bản sản phẩm'); // ✅ Thay thế message.info
                router.push(`/products/${product.slug || product.id}`);
            } else {
                toast.error('Không thể thêm vào giỏ hàng. Vui lòng thử lại!'); // ✅ Thay thế message.error
            }
        } finally {
            setAddingToCart(null);
        }
    };

    const skeletons = useMemo(() => Array.from({ length: 8 }), []);

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-3 sm:px-6 py-3 sm:py-4 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <h2 className="text-base sm:text-xl font-bold text-gray-800">Sản phẩm</h2>
                        <div className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium">
                            {new Intl.NumberFormat('vi-VN').format(total)} SP
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-2 hidden sm:flex">
                            <span className="text-xs sm:text-sm text-gray-600 font-medium">Sắp xếp:</span>
                            <CustomSelect
                                value={filters.sort}
                                onChange={() => toast.info('Thay đổi sắp xếp ở bộ lọc phía trên')}
                                className="min-w-[100px] sm:min-w-[140px]"
                                options={[
                                    { label: 'Mới nhất', value: 'newest' },
                                    { label: 'Giá tăng', value: 'priceAsc' },
                                    { label: 'Giá giảm', value: 'priceDesc' },
                                    { label: 'Tên A-Z', value: 'nameAsc' },
                                    { label: 'Tên Z-A', value: 'nameDesc' },
                                ]}
                            />
                        </div>
                        {/* View Mode Buttons */}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                            <CustomButton
                                type={viewMode === 'grid' ? 'primary' : 'text'}
                                icon={<LayoutGrid className="w-4 h-4" />} // ✅ 
                                onClick={() => setViewMode('grid')}
                                className={cn("!border-0 !p-2 cursor-pointer", viewMode === 'grid' && "!bg-blue-600 text-white")}
                            />
                            <CustomButton
                                type={viewMode === 'list' ? 'primary' : 'text'}
                                icon={<List className="w-4 h-4" />} 
                                onClick={() => setViewMode('list')}
                                className={cn("!border-0 !p-2 cursor-pointer hidden sm:inline-flex", viewMode === 'list' && "!bg-blue-600 text-white")}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-3 sm:p-6">
                {loading ? (
                    <GridSkeleton count={8} /> 
                ) : products.length === 0 ? (
                    <div className="text-center flex w-full justify-center items-center flex-col py-16 gap-2">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">Không tìm thấy sản phẩm</h3>
                        <p className="text-gray-500 mb-6">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                        <CustomButton type="primary" onClick={() => window.location.reload()} className="px-4 !py-2 rounded-2xl cursor-pointer">
                            Làm mới trang
                        </CustomButton>
                    </div>
                ) : (
                    <>
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {products.map((product) => (
                                    <div key={product.id} className="bg-gray-50 rounded-xl p-6 flex gap-6 items-start hover:shadow-md transition-all duration-300 group">
                                        <div className="relative">
                                            <img
                                                src={getPrimaryImage(product.media)}
                                                alt={product.name}
                                                className="w-32 h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                                                }}
                                                loading="lazy"
                                            />
                                            <div className="absolute top-2 right-2">
                                                <CustomButton
                                                    icon={<Heart className="w-4 h-4" />} 
                                                    className="!bg-white/80 hover:!bg-white text-gray-600 hover:text-red-500 shadow-sm !p-2"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <a
                                                        href={`/products/${product.slug || product.id}`}
                                                        className="text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 group-hover:text-blue-600 transition-colors"
                                                    >
                                                        {product.name}
                                                    </a>
                                                    <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                                        <span>{product.category.name}</span>
                                                        <span>•</span>
                                                        <div className="flex items-center">
                                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" /> {/* ✅ Thay thế StarOutlined */}
                                                            <span>4.5</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <div className="text-xl font-bold text-red-600">
                                                        {product.basePrice ? formatPrice(product.basePrice) : 'Liên hệ'}
                                                    </div>
                                                    <div className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full inline-block mt-1">
                                                        Còn hàng
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 mt-3 line-clamp-2">{product.description}</p>
                                            <div className="flex items-center gap-3 mt-4">
                                                <CustomButton
                                                    type="primary"
                                                    icon={<ShoppingCart className="w-4 h-4" />}
                                                    onClick={() => handleAddToCart(product)}
                                                    loading={addingToCart === product.id}
                                                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 border-0 hover:from-orange-600 hover:to-red-600 !h-10 !text-sm"
                                                >
                                                    {addingToCart === product.id ? 'Đang thêm...' : 'Thêm vào giỏ'}
                                                </CustomButton>
                                                <CustomButton icon={<Heart className="w-4 h-4" />} className="px-3 hover:text-red-500 hover:border-red-500 !h-10 !text-sm">
                                                    Yêu thích
                                                </CustomButton>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="mt-8 flex justify-center">
                            <CustomPagination
                                page={page}
                                pageSize={pageSize}
                                total={total}
                                onChange={(p: number, ps: number) => { // ✅ Fix Implicit any
                                    setPage(p);
                                    setPageSize(ps);
                                }}
                                showTotal={(total: number, range: [number, number]) => // ✅ Fix Implicit any
                                    `${range[0]}-${range[1]} của ${total} sản phẩm`
                                }
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}