"use client";

import { useInfiniteQuery, useQueries } from "@tanstack/react-query";
import { homepageService } from "../services/homepage.service";
import { CategoryService } from "../../category/_service/category.service";
import { publicProductService } from "@/app/(shop)/shop/products/_services/product.service";
import { useMemo } from "react";

export const useHomepageData = (locale: string = "vi") => {
  const deviceType = useMemo(() => {
    if (typeof window === "undefined") return "ALL";
    return window.innerWidth >= 768 ? "DESKTOP" : "MOBILE";
  }, []);

  const results = useQueries({
    queries: [
      {
        queryKey: ["banners", locale, deviceType],
        queryFn: () =>
          homepageService.getBannersByPage({
            page: "HOMEPAGE",
            locale,
            device: deviceType,
          }),
        staleTime: 1000 * 60 * 10,
      },
      {
        queryKey: ["categories", locale],
        queryFn: () => CategoryService.getAllParents(),
        staleTime: 1000 * 60 * 30,
      },
      {
        queryKey: ["flashsale", locale],
        queryFn: () => publicProductService.getSale(0, 6),
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: ["featured-products", locale],
        queryFn: () => publicProductService.getFeatured(0, 12),
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: ["homepage", "sale", locale],
        queryFn: () => publicProductService.getSale(0, 12),
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: ["homepage", "new", locale],
        queryFn: () => publicProductService.getNewProducts(0, 12),
        staleTime: 1000 * 60 * 5,
      },
    ],
  });

  const [bannersQ, categoriesQ, flashSaleQ, featuredQ, saleQ, newQ] = results;

  const banners = useMemo(() => {
    const raw =
      bannersQ.data?.data?.banners || (bannersQ.data as any)?.banners || {};
    return {
      hero: raw["HOMEPAGE_HERO"] || [],
      intro: raw["HOMEPAGE_INTRO"] || [],
      sidebar: raw["HOMEPAGE_SIDEBAR"] || [],
      footer: raw["HOMEPAGE_FOOTER"] || [],
    };
  }, [bannersQ.data]);

  const extractContent = (query: any) => {
    return (
      query.data?.data?.content ||
      query.data?.content ||
      query.data?.data ||
      (Array.isArray(query.data) ? query.data : []) ||
      []
    );
  };

  return {
    banners,
    categories: categoriesQ.data?.data || (categoriesQ.data as any) || [],
    flashSale: extractContent(flashSaleQ),
    featured: extractContent(featuredQ),
    saleProducts: extractContent(saleQ),
    newProducts: extractContent(newQ),

    isLoading: bannersQ.isLoading || categoriesQ.isLoading,
    isInitialLoading: results.some((q) => q.isInitialLoading),
    isError: results.some((query) => query.isError),
    refetchAll: () => results.forEach((query) => query.refetch()),
  };
};

export const useInfiniteProducts = (type: "sale" | "new") => {
  return useInfiniteQuery({
    queryKey: ["products", type],
    queryFn: ({ pageParam = 0 }) =>
      type === "sale"
        ? publicProductService.getSale(pageParam, 12)
        : publicProductService.getNewProducts(pageParam, 12),
    getNextPageParam: (lastPage: any) => {
      const pageData = lastPage?.data?.data || lastPage?.data;
      if (pageData && typeof pageData.number === "number") {
        return pageData.number + 1 < pageData.totalPages
          ? pageData.number + 1
          : undefined;
      }
      return undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
  });
};
