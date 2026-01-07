"use client";

import { CustomBreadcrumb } from "@/components";
import PageContentTransition from "@/features/PageContentTransition";
import { wishlistService } from "@/services/wishlist/wishlist.service";
import type { WishlistResponse } from "@/types/wishlist/wishlist.types";
import {
  ArrowLeft,
  Calendar,
  Heart,
  Loader2,
  Lock,
  Package,
  User,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { WishlistItemCard } from "../WishlistItemCard";
import { SectionPageComponents } from "@/features/SectionPageComponents";

interface Props {
  shareToken: string;
}

export default function PublicWishlistClient({ shareToken }: Props) {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishlistResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWishlist();
  }, [shareToken]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await wishlistService.getPublicWishlistByShareToken(
        shareToken
      );
      setWishlist(data);
    } catch (err: any) {
      console.error("Error loading shared wishlist:", err);
      setError(
        err.response?.data?.message ||
          "Danh sách này không khả dụng hoặc đã được chuyển sang chế độ riêng tư."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCoverImageUrl = (wishlist: WishlistResponse) => {
    if (!wishlist.imageBasePath || !wishlist.imageExtension) return null;
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "";
    return `${baseUrl}/${wishlist.imageBasePath}_orig${wishlist.imageExtension}`;
  };

  const breadcrumbData = [
    { title: "Trang chủ", href: "/" },
    { title: "Wishlist chia sẻ", href: "#" },
  ];

  return (
    <SectionPageComponents
      loading={loading} 
      loadingMessage="Đang tải danh mục yêu thích..."
      breadcrumbItems={breadcrumbData}
    >
      {error ? (
        <div className="max-w-xl mx-auto bg-white border border-gray-200 rounded-[2.5rem] p-12 text-center shadow-xl shadow-gray-200/50">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-500">
            <Lock size={40} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 uppercase">
            Không thể truy cập
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-gray-200"
          >
            <ArrowLeft size={18} /> Quay về trang chủ
          </button>
        </div>
      ) : wishlist ? (
        <div className="space-y-10">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -mr-32 -mt-32" />

            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
              <div className="shrink-0">
                {getCoverImageUrl(wishlist) ? (
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500">
                    <Image
                      src={getCoverImageUrl(wishlist)!}
                      alt={wishlist.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-linear-to-br from-orange-500 to-rose-500 rounded-[2rem] flex items-center justify-center shadow-xl shadow-orange-100 rotate-3">
                    <Heart className="text-white w-16 h-16" strokeWidth={1.5} />
                  </div>
                )}
              </div>

              {/* Text Content */}
              <div className="flex-1 space-y-4">
                <h1 className="text-3xl md:text-5xl font-semibold tracking-tighter text-gray-950 uppercase italic">
                  {wishlist.name}
                </h1>

                <div className="flex flex-wrap gap-y-3 gap-x-6">
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-900">
                      <User size={14} />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-tight">
                      {wishlist.buyerName || "Ẩn danh"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-900">
                      <Calendar size={14} />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-tight">
                      {formatDate(wishlist.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                    <Package size={14} />
                    <span className="text-xs font-semibold uppercase tracking-widest">
                      {wishlist.itemCount} sản phẩm
                    </span>
                  </div>
                </div>

                {wishlist.description && (
                  <p className="text-gray-500 text-lg font-light leading-relaxed border-l-4 border-orange-500 pl-6 py-2">
                    {wishlist.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Items Grid */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gray-900 rounded-full" />
              <h2 className="text-2xl font-semibold uppercase tracking-tight">
                Danh sách sản phẩm
              </h2>
            </div>

            {wishlist.items && wishlist.items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlist.items.map((item) => (
                  <WishlistItemCard
                    key={item.id}
                    item={item}
                    onRemove={() => {}}
                    onAddToCart={() => {}}
                    isRemoving={false}
                    isAddingToCart={false}
                    readOnly={true}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-dashed border-gray-200 rounded-[2.5rem] py-20 text-center">
                <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">
                  Wishlist này hiện đang trống
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </SectionPageComponents>
  );
}
