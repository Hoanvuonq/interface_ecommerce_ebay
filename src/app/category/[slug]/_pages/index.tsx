import React from "react";
import Link from "next/link";
import { ProductCard } from "@/app/products/_components/ProductCard";
import { publicProductService } from "@/services/products/product.service";
import { CategoryService } from "@/services/categories/category.service";

import CategoryBanner from "../_components/CategoryBanner";
import FeaturedShopsGrid from "../_components/FeaturedShopsGrid";
import QuickAccessCards from "../_components/QuickAccessCards";
import CategoryFilter from "../_components/CategoryFilter";

export const dynamic = "force-dynamic";

export default async function CategoryScreen({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{
    page?: string;
    size?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    showMore?: string;
  }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const rawSlug = resolvedParams.slug || "";
  const page = Number(resolvedSearchParams?.page ?? 0);
  const size = Number(resolvedSearchParams?.size ?? 24);
  const sort = resolvedSearchParams?.sort || "";
  const minPrice = resolvedSearchParams?.minPrice || "";
  const maxPrice = resolvedSearchParams?.maxPrice || "";
  const showMore = (resolvedSearchParams?.showMore || "") === "1";

  let content: any[] = [];
  let categories: any[] = [];
  let currentCategory: any | null = null;
  let currentChildren: any[] = [];
  let totalPages = 1;
  let errorMessage: string | null = null;

  // Load products by category slug
  try {
    const res = await publicProductService.getByCategorySlug(
      rawSlug,
      page,
      size
    );
    const data =
      res && typeof res === "object" && "data" in (res as any)
        ? (res as any).data
        : res;
    content = Array.isArray(data?.content) ? data.content : [];
    totalPages =
      typeof data?.totalPages === "number" ? data.totalPages : totalPages;
  } catch (e: any) {
    errorMessage = "Không thể tải sản phẩm. Vui lòng thử lại sau.";
  }

  // Load categories tree and resolve current category by slug -> children
  try {
    const cats = await CategoryService.getAllParents();
    const list =
      cats && typeof cats === "object" && "data" in (cats as any)
        ? (cats as any).data
        : cats;
    categories = Array.isArray(list) ? list : [];

    // find current category recursively by slug
    const targetSlug = decodeURIComponent(rawSlug).toLowerCase();
    const findBySlug = (nodes: any[]): any | null => {
      for (const n of nodes) {
        if ((n.slug || "").toLowerCase() === targetSlug) return n;
        if (Array.isArray(n.children) && n.children.length > 0) {
          const found = findBySlug(n.children);
          if (found) return found;
        }
      }
      return null;
    };
    currentCategory = findBySlug(categories);
    currentChildren = Array.isArray(currentCategory?.children)
      ? currentCategory.children
      : [];
  } catch {}

  // Helpers to build query strings for sort/price quickly (link-based)
  const makeQuery = (next: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("size", String(size));
    if (sort) params.set("sort", sort);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (showMore) params.set("showMore", "1");
    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") return;
      params.set(k, String(v));
    });
    return `?${params.toString()}`;
  };

  // Toggle giá asc/desc
  const nextPriceSort =
    sort === "basePrice,asc" ? "basePrice,desc" : "basePrice,asc";

  // Pager helpers
  const canPrev = page > 0;
  const canNext = page + 1 < totalPages;

  // Visible children categories
  const visibleChildren = showMore
    ? currentChildren
    : currentChildren.slice(0, 10);

  return (
    <>
      <section className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 py-6">
        <div className="mx-auto max-w-300 px-3 md:px-4 lg:px-0">
          <CategoryBanner
            categorySlug={rawSlug}
            categoryId={currentCategory?.id}
          />
          <FeaturedShopsGrid categorySlug={rawSlug} />
          <QuickAccessCards categorySlug={rawSlug} />

          <div className="grid grid-cols-12 gap-4">
            <aside className="col-span-12 lg:col-span-3 xl:col-span-2 text-[13px] text-slate-700">
              <div className="space-y-4">
                <div className="rounded-lg bg-white p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <CategoryFilter
                    currentCategory={currentCategory}
                    currentChildren={currentChildren}
                    allCategories={categories}
                    currentSlug={rawSlug}
                  />
                </div>

                <div className="rounded-lg bg-white shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-linear-to-rm-orange-50 to-rose-50 border-b border-orange-100 px-4 py-3">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                        />
                      </svg>
                      BỘ LỌC TÌM KIẾM
                    </h3>
                  </div>

                  <div className="divide-y divide-gray-100">
                    <div className="px-3 py-3">
                      <div className="text-xs font-medium text-gray-900 mb-2">
                        Nơi bán
                      </div>
                      <div className="space-y-2">
                        {["Toàn quốc", "Hà Nội", "TP.HCM"].map((label) => (
                          <label
                            key={label}
                            className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer hover:text-[#ee4d2d]"
                          >
                            <input
                              type="checkbox"
                              className="mt-0.5 h-4 w-4  shrink-0 rounded border-gray-300"
                            />
                            <span className="wrap-break-words">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="px-3 py-3">
                      <div className="text-xs font-medium text-gray-900 mb-2">
                        Vận chuyển
                      </div>
                      <div className="space-y-2">
                        {["Nhanh", "Hỏa tốc"].map((label) => (
                          <label
                            key={label}
                            className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer hover:text-[#ee4d2d]"
                          >
                            <input
                              type="checkbox"
                              className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300"
                            />
                            <span className="wrap-break-words">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Khoảng giá */}
                    <div className="px-3 py-3">
                      <div className="text-xs font-medium text-gray-900 mb-2">
                        Khoảng giá
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          className="flex-1 min-w-0 border border-gray-300 rounded px-2 py-1.5 text-xs focus:border-[#ee4d2d] focus:outline-none"
                          placeholder="₫ TỪ"
                          defaultValue={minPrice}
                        />
                        <span className="text-gray-400 text-xs shrink-0">
                          -
                        </span>
                        <input
                          type="number"
                          className="flex-1 min-w-0 border border-gray-300 rounded px-2 py-1.5 text-xs focus:border-[#ee4d2d] focus:outline-none"
                          placeholder="₫ ĐẾN"
                          defaultValue={maxPrice}
                        />
                      </div>
                      <button className="mt-2 w-full bg-[#ee4d2d] hover:bg-[#d73f21] transition-colors rounded py-1.5 text-xs font-medium text-white">
                        ÁP DỤNG
                      </button>
                    </div>

                    <div className="px-3 py-3">
                      <div className="text-xs font-medium text-gray-900 mb-2">
                        Đánh giá
                      </div>
                      <div className="space-y-2">
                        {[5, 4, 3].map((star) => (
                          <Link
                            key={star}
                            href={makeQuery({ minRating: `${star}` })}
                            className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-[#ee4d2d] transition-colors"
                          >
                            <span className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <svg
                                  key={idx}
                                  viewBox="0 0 24 24"
                                  className={`h-3 w-3 ${
                                    idx < star
                                      ? "fill-[#fbbf24]"
                                      : "fill-gray-300"
                                  }`}
                                >
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                              ))}
                            </span>
                            <span className="text-xs">từ {star} sao</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="px-3 py-3">
                      <div className="text-xs font-medium text-gray-900 mb-2">
                        Dịch vụ
                      </div>
                      <div className="space-y-2">
                        {["Freeship", "Giảm giá", "Hoàn xu"].map((label) => (
                          <label
                            key={label}
                            className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer hover:text-[#ee4d2d]"
                          >
                            <input
                              type="checkbox"
                              className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300"
                            />
                            <span className="wrap-break-words">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="px-3 py-2.5">
                      <button className="w-full text-xs text-gray-600 hover:text-[#ee4d2d] transition-colors">
                        XÓA TẤT CẢ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <div className="col-span-12 lg:col-span-9 xl:col-span-10 space-y-3">
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3.5 shadow-md text-[13px] text-slate-700">
                <span className="font-semibold text-gray-900 flex items-center gap-1.5">
                  <svg
                    className="h-4 w-4 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                  Sắp xếp:
                </span>
                <Link
                  href={makeQuery({ sort: "", page: 0 })}
                  className={`rounded-lg border px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
                    !sort
                      ? "border-orange-500 bg-linear-to-r from-orange-500 to-rose-500 text-white shadow-md"
                      : "border-gray-200 bg-white text-gray-700 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  Liên quan
                </Link>
                <Link
                  href={makeQuery({ sort: "createdDate,desc", page: 0 })}
                  className={`rounded-lg border px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
                    sort === "createdDate,desc"
                      ? "border-orange-500 bg-linear-to-r from-orange-500 to-rose-500 text-white shadow-md"
                      : "border-gray-200 bg-white text-gray-700 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  Mới nhất
                </Link>
                <Link
                  href={makeQuery({ sort: "sold,desc", page: 0 })}
                  className={`rounded-lg border px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
                    sort === "sold,desc"
                      ? "border-orange-500 bg-linear-to-r from-orange-500 to-rose-500 text-white shadow-md"
                      : "border-gray-200 bg-white text-gray-700 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  Bán chạy
                </Link>
                <div className="flex overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                  <Link
                    href={makeQuery({ sort: "basePrice,asc", page: 0 })}
                    className={`px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
                      sort === "basePrice,asc"
                        ? "bg-linear-to-r from-orange-500 to-rose-500 text-white"
                        : "bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                  >
                    Giá ↑
                  </Link>
                  <Link
                    href={makeQuery({ sort: "basePrice,desc", page: 0 })}
                    className={`border-l border-gray-200 px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
                      sort === "basePrice,desc"
                        ? "bg-linear-to-r from-orange-500 to-rose-500 text-white"
                        : "bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                  >
                    Giá ↓
                  </Link>
                </div>
              </div>

              {errorMessage ? (
                <div className="border border-red-200 bg-white px-4 py-3 text-sm text-red-600">
                  {errorMessage}
                </div>
              ) : content.length === 0 ? (
                <div className="border border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-600">
                  Không có sản phẩm.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5 md:grid-cols-4 md:gap-4 lg:grid-cols-5 lg:gap-4">
                    {content.map((p: any) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-3 text-[13px] text-gray-700 py-4">
                    <Link
                      aria-disabled={!canPrev}
                      className={`flex items-center gap-2 rounded-lg border px-5 py-2.5 font-medium transition-all duration-200 ${
                        canPrev
                          ? "border-gray-300 bg-white text-gray-700 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600 shadow-sm hover:shadow-md"
                          : "pointer-events-none border-gray-200 bg-gray-50 text-gray-300"
                      }`}
                      href={makeQuery({ page: Math.max(page - 1, 0) })}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Trước
                    </Link>
                    <span className="px-4 py-2 font-semibold text-gray-900">
                      Trang {page + 1}/{totalPages}
                    </span>
                    <Link
                      aria-disabled={!canNext}
                      className={`flex items-center gap-2 rounded-lg border px-5 py-2.5 font-medium transition-all duration-200 ${
                        canNext
                          ? "border-gray-300 bg-white text-gray-700 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600 shadow-sm hover:shadow-md"
                          : "pointer-events-none border-gray-200 bg-gray-50 text-gray-300"
                      }`}
                      href={makeQuery({
                        page: Math.min(page + 1, totalPages - 1),
                      })}
                    >
                      Sau
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
