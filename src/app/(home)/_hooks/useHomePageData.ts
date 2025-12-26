// import { useEffect, useState, useRef } from "react";
// import { homepageService } from "../services/homepage.service";
// import { CategoryService } from "@/services/categories/category.service";
// import { publicProductService } from "@/services/products/product.service";
// import { CartDto } from "@/types/cart/cart.types";
// import { BannerResponseDTO } from "../_types/banner.dto";
// import { PublicCategoryDTO, PublicProductListItemDTO } from "@/types/product/public-product.dto";
// import { CategoryResponse } from "@/types/categories/category.detail";

// interface HomePageData {
//     banners: BannerResponseDTO[];
//     categories: PublicCategoryDTO[];
//     products: PublicProductListItemDTO[];
//     cart: CartDto | null;
//     loading: boolean;
//     error: string | null;
// }

// export function useHomePageData(locale: string = "vi", device: string = "DESKTOP") {
//     const [data, setData] = useState<HomePageData>({
//         banners: [],
//         categories: [],
//         products: [],
//         cart: null,
//         loading: true,
//         error: null,
//     });

//     // Chỉ fetch 1 lần cho mỗi cặp locale/device
//     const fetchedParamsRef = useRef<{ locale: string; device: string }[]>([]);
//     const isFetchingRef = useRef(false);

//     useEffect(() => {
//         const currentParams = { locale, device };
//         // Nếu đã fetch rồi thì không gọi lại nữa
//         if (fetchedParamsRef.current.some(
//             (p) => p.locale === currentParams.locale && p.device === currentParams.device
//         )) {
//             setData((prev) => ({ ...prev, loading: false }));
//             return;
//         }
//         if (isFetchingRef.current) return;

//         let isMounted = true;
//         setData((prev) => ({ ...prev, loading: true, error: null }));
//         isFetchingRef.current = true;

//         Promise.all([
//             homepageService.getBannersByPage({ page: "HOMEPAGE", locale, device }),
//             CategoryService.getAllParents(),
//             publicProductService.getFeatured(0, 12),
//             import("@/services/cart/cart.service").then(mod => mod.getCart()),
//         ])
//             .then(([bannersRes, categoriesRes, productsRes, cartRes]) => {
//                 if (!isMounted) return;
//                 setData({
//                     banners: bannersRes?.data?.banners?.HOMEPAGE_HERO || [],
//                     categories: categoriesRes?.data || [],
//                     products: productsRes?.data?.content || [],
//                     cart: cartRes?.data || null,
//                     loading: false,
//                     error: null,
//                 });
//                 // Đánh dấu đã fetch
//                 fetchedParamsRef.current.push(currentParams);
//             })
//             .catch((err) => {
//                 if (!isMounted) return;
//                 setData((prev) => ({ ...prev, loading: false, error: err?.message || "Lỗi tải dữ liệu" }));
//             })
//             .finally(() => {
//                 isFetchingRef.current = false;
//             });

//         return () => {
//             isMounted = false;
//         };
//     }, [locale, device]);

//     return data;
// }
// export async function getCart(): Promise<{ data: CartDto | null }> {
//     try {
//         const cartJson = localStorage.getItem('cart');
//         if (cartJson) {
//             const cart: CartDto = JSON.parse(cartJson);
//             return { data: cart };
//         }
//         return { data: null };
//     } catch (error) {
//         return { data: null };
//     }
// }