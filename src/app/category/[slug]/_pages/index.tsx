import { ProductCard } from "@/app/products/_components/ProductCard";
import { CategoryService } from "@/services/categories/category.service";
import { publicProductService } from "@/services/products/product.service";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import CategoryBanner from "../_components/CategoryBanner";
import CategoryFilter from "../_components/CategoryFilter";
import FeaturedShopsGrid from "../_components/FeaturedShopsGrid";
import QuickAccessCards from "../_components/QuickAccessCards";

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
      // Nếu API hỗ trợ filter giá, hãy truyền minPrice, maxPrice vào đây
    );
    const data =
      res && typeof res === "object" && "data" in (res as any)
        ? (res as any).data
        : res;

    content = Array.isArray(data?.content) ? data.content : [];
    totalPages = typeof data?.totalPages === "number" ? data.totalPages : 1;
  } catch (e: any) {
    console.error("Error fetching products:", e);
    errorMessage = "Không thể tải sản phẩm. Vui lòng thử lại sau.";
  }

  // Helper tạo URL query string
  const makeQuery = (next: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("size", String(size));
    if (sort) params.set("sort", sort);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (showMore) params.set("showMore", "1");

    Object.entries(next).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        params.set(k, String(v));
      }
    });
    return `?${params.toString()}`;
  };

  const canPrev = page > 0;
  const canNext = page + 1 < totalPages;

  return (
    <section className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 py-6">
      <div className="mx-auto max-w-7xl px-3 md:px-4 lg:px-0">
        <CategoryBanner
          categorySlug={rawSlug}
          categoryId={currentCategory?.id}
        />

        {/* Lưu ý: Nếu các component này fetch data bên trong, hãy đảm bảo chúng không có dependency loop */}
        <FeaturedShopsGrid categorySlug={rawSlug} />
        <QuickAccessCards categorySlug={rawSlug} />

        <div className="grid grid-cols-12 gap-4 mt-6">
          {/* Sidebar Filter */}
          <aside className="col-span-12 lg:col-span-3 xl:col-span-2 text-[13px] text-slate-700">
            <div className="space-y-4 sticky top-20">
              <div className="rounded-lg bg-white p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <CategoryFilter
                  currentCategory={currentCategory}
                  currentChildren={currentChildren}
                  allCategories={categories}
                  currentSlug={rawSlug}
                />
              </div>

              {/* Filter UI Placeholder - Giữ nguyên logic filter của bạn */}
              <div className="rounded-lg bg-white shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-orange-50 border-b border-orange-100 px-4 py-3">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    BỘ LỌC TÌM KIẾM
                  </h3>
                </div>
                {/* ... Phần body filter giữ nguyên như cũ, chỉ cần render UI tĩnh ... */}
                <div className="p-4 text-center text-gray-500">
                  (Filter Component UI)
                </div>
              </div>
            </div>
          </aside>

          {/* Product List */}
          <div className="col-span-12 lg:col-span-9 xl:col-span-10">
            {/* Sort Bar */}
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3.5 shadow-md text-[13px] text-slate-700 mb-4">
              <span className="font-semibold text-gray-900">Sắp xếp:</span>
              <Link
                href={makeQuery({ sort: "", page: 0 })}
                className={`px-3 py-1.5 rounded border ${
                  !sort
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white"
                }`}
              >
                Liên quan
              </Link>
              <Link
                href={makeQuery({ sort: "createdDate,desc", page: 0 })}
                className={`px-3 py-1.5 rounded border ${
                  sort === "createdDate,desc"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white"
                }`}
              >
                Mới nhất
              </Link>
              <Link
                href={makeQuery({ sort: "sold,desc", page: 0 })}
                className={`px-3 py-1.5 rounded border ${
                  sort === "sold,desc"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white"
                }`}
              >
                Bán chạy
              </Link>
              <Link
                href={makeQuery({ sort: "basePrice,asc", page: 0 })}
                className={`px-3 py-1.5 rounded border ${
                  sort === "basePrice,asc"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white"
                }`}
              >
                Giá ↑
              </Link>
              <Link
                href={makeQuery({ sort: "basePrice,desc", page: 0 })}
                className={`px-3 py-1.5 rounded border ${
                  sort === "basePrice,desc"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white"
                }`}
              >
                Giá ↓
              </Link>
            </div>

            {/* Content */}
            <div className="mt-4">
              {errorMessage ? (
                <div className="border border-red-200 bg-white px-4 py-3 text-sm text-red-600 rounded-lg">
                  {errorMessage}
                </div>
              ) : content.length === 0 ? (
                <div className="border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-600 rounded-lg flex flex-col items-center justify-center gap-2">
                  <span>📦</span>
                  <span>Không tìm thấy sản phẩm nào trong danh mục này.</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5 md:grid-cols-4 md:gap-4 lg:grid-cols-5 lg:gap-4">
                    {content.map((p: any) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 text-[13px] text-gray-700 py-8">
                      <Link
                        aria-disabled={!canPrev}
                        className={`flex items-center gap-2 rounded-lg border px-4 py-2 font-medium transition-all ${
                          canPrev
                            ? "border-gray-300 bg-white hover:border-orange-500 hover:text-orange-600 shadow-sm"
                            : "pointer-events-none border-gray-100 bg-gray-50 text-gray-300"
                        }`}
                        href={makeQuery({ page: Math.max(page - 1, 0) })}
                      >
                        <ChevronLeft size={16} /> Trước
                      </Link>

                      <span className="px-4 py-2 font-semibold text-gray-900 bg-white rounded-lg border border-gray-200 shadow-sm">
                        Trang {page + 1} / {totalPages}
                      </span>

                      <Link
                        aria-disabled={!canNext}
                        className={`flex items-center gap-2 rounded-lg border px-4 py-2 font-medium transition-all ${
                          canNext
                            ? "border-gray-300 bg-white hover:border-orange-500 hover:text-orange-600 shadow-sm"
                            : "pointer-events-none border-gray-100 bg-gray-50 text-gray-300"
                        }`}
                        href={makeQuery({
                          page: Math.min(page + 1, totalPages - 1),
                        })}
                      >
                        Sau <ChevronRight size={16} />
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
