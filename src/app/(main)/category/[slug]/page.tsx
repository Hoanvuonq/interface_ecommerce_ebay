import { ProductCard } from "@/app/(main)/products/_components/ProductCard";
import { CategoryService } from "@/services/categories/category.service";
import { publicProductService } from "@/services/products/product.service";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  LayoutGrid,
  SortDesc,
} from "lucide-react";
import Link from "next/link";
import CategoryBanner from "./_components/CategoryBanner";
import CategoryFilter from "./_components/CategoryFilter";
import FeaturedShopsGrid from "./_components/FeaturedShopsGrid";
import QuickAccessCards from "./_components/QuickAccessCards";
import { cn } from "@/utils/cn";
import SortBar from "./_components/SortSelect";
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

  // --- Logic Fetching (Giữ nguyên) ---
  try {
    const catsRes = await CategoryService.getAllParents();
    const list =
      catsRes && typeof catsRes === "object" && "data" in (catsRes as any)
        ? (catsRes as any).data
        : catsRes;
    categories = Array.isArray(list) ? list : [];

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
  } catch (err) {
    console.error("Error fetching categories:", err);
  }

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
    totalPages = typeof data?.totalPages === "number" ? data.totalPages : 1;
  } catch (e: any) {
    errorMessage = "Không thể tải sản phẩm. Vui lòng thử lại sau.";
  }

  const makeQuery = (next: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("size", String(size));
    if (sort) params.set("sort", sort);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (showMore) params.set("showMore", "1");
    Object.entries(next).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
    });
    return `?${params.toString()}`;
  };

  const canPrev = page > 0;
  const canNext = page + 1 < totalPages;

  return (
    <section className="min-h-screen bg-[#f5f5f5] pb-12">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 md:py-6">
          <CategoryBanner
            categorySlug={rawSlug}
            categoryId={currentCategory?.id}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 mt-6">
        {/* 2. Marketing Sections */}
        <div className="space-y-6 mb-8">
          <FeaturedShopsGrid categorySlug={rawSlug} />
          <QuickAccessCards categorySlug={rawSlug} />
        </div>

        <div className="grid grid-cols-12 gap-6 mt-6">
          <aside className="col-span-12 lg:col-span-3 xl:col-span-2 space-y-5">
            <div className="sticky top-24 space-y-5">
              <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
                <CategoryFilter
                  currentCategory={currentCategory}
                  currentChildren={currentChildren}
                  allCategories={categories}
                  currentSlug={rawSlug}
                />
              </div>

              <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-orange-50/50 border-b border-orange-100 px-5 py-4 flex items-center gap-2.5">
                  <Filter size={18} className="text-orange-600" />
                  <h3 className="text-[15px] font-bold text-gray-900 uppercase tracking-tight">
                    Bộ lọc tìm kiếm
                  </h3>
                </div>
                <div className="p-5 space-y-4">
                  {/* Placeholder for Price/Rating filters */}
                  <div className="text-xs text-gray-400 italic">
                    Công cụ lọc đang được đồng bộ...
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="col-span-12 lg:col-span-9 xl:col-span-10">
            <SortBar
              currentSort={sort}
              currentPage={page}
              totalPages={totalPages}
            />

            <div className="min-h-[400px]">
              {errorMessage ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-red-100">
                  <p className="text-red-500 font-medium">{errorMessage}</p>
                </div>
              ) : content.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <PackageSearch size={40} className="text-gray-300" />
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg">
                    Không có sản phẩm nào
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Hãy thử thay đổi bộ lọc hoặc danh mục khác nhé!
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                    {content.map((p: any) => (
                      <div
                        key={p.id}
                        className="transition-transform duration-300 hover:-translate-y-1"
                      >
                        <ProductCard product={p} />
                      </div>
                    ))}
                  </div>

                  {/* Enhanced Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-12 py-6">
                      <Link
                        href={makeQuery({ page: Math.max(page - 1, 0) })}
                        className={cn(
                          "flex items-center gap-2 rounded-2xl bg-white border border-gray-200 px-6 py-3 font-bold text-gray-700 shadow-sm transition-all hover:border-orange-500 hover:text-orange-600",
                          !canPrev &&
                            "pointer-events-none opacity-40 bg-gray-50"
                        )}
                      >
                        <ChevronLeft size={20} /> Trước
                      </Link>

                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-500 text-white font-semibold shadow-lg shadow-orange-100">
                          {page + 1}
                        </span>
                        <span className="text-gray-400 font-medium px-2">
                          của {totalPages} trang
                        </span>
                      </div>

                      <Link
                        href={makeQuery({
                          page: Math.min(page + 1, totalPages - 1),
                        })}
                        className={cn(
                          "flex items-center gap-2 rounded-2xl bg-white border border-gray-200 px-6 py-3 font-bold text-gray-700 shadow-sm transition-all hover:border-orange-500 hover:text-orange-600",
                          !canNext &&
                            "pointer-events-none opacity-40 bg-gray-50"
                        )}
                      >
                        Sau <ChevronRight size={20} />
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Sub-component cho icon Empty state (nếu chưa có)
function PackageSearch({
  size,
  className,
}: {
  size: number;
  className?: string;
}) {
  return <LayoutGrid size={size} className={className} />;
}
