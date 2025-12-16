
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { searchService, SuggestionItemDTO } from "@/services/search/search.service";
import React from "react";


export interface SearchOption {
  value: string;
  label: React.ReactNode;
  item: SuggestionItemDTO;
}

const SEARCH_DEBOUNCE_MS = 300;

export const useProductSearch = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [searchOptions, setSearchOptions] = useState<SearchOption[]>([]);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  // --- 1. TRACKING SEARCH ---
  const handleTrackSearchSafe = useCallback(async (keyword: string, source: 'SUBMIT' | 'SUGGESTION_CLICK', categoryId?: string) => {
    try {
      const trimmed = keyword.trim();
      if (!trimmed) return;
      await searchService.trackSearch({ keyword: trimmed, categoryId, source });
    } catch {
    }
  }, []);

  // --- 2. NAVIGATION ---
  const handleNavigateToProducts = useCallback((keyword: string, categoryId?: string) => {
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (categoryId) params.set('categoryId', categoryId);
    const qs = params.toString();
    router.push(qs ? `/products?${qs}` : '/products');
  }, [router]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    const trimmed = value.trim();
    if (!trimmed) {
      setSearchOptions([]);
      return;
    }

    searchDebounceRef.current = setTimeout(async () => {
      try {
        const res = await searchService.getSuggestions({ q: trimmed, limit: 10 });
        const options: SearchOption[] = (res.suggestions || []).map((s) => ({
          value: s.keyword,
          item: s,
          label: (
            // Logic rendering suggestion label
            <div key={s.keyword} className="flex flex-col">
              <span className="font-medium">{s.keyword}</span>
              {typeof s.searchCount === "number" && (
                <span className="text-xs text-gray-400">
                  Đã tìm {new Intl.NumberFormat("vi-VN").format(s.searchCount)}{" "} lần
                </span>
              )}
            </div>
          ),
        }));
        setSearchOptions(options);
      } catch {
        setSearchOptions([]);
      }
    }, SEARCH_DEBOUNCE_MS);
  }, []);

  // --- 4. SUGGESTION SELECTION ---
  const handleSuggestionSelect = useCallback((option: { value: string; item: SuggestionItemDTO }) => {
    const { value: keyword, item } = option;
    const source = (item.source || '').toUpperCase();

    setSearchValue(keyword);
    setSearchOptions([]);

    if (source === 'PRODUCT' && (item.productSlug || item.productId)) {
      const idOrSlug = item.productSlug || item.productId!;
      router.push(`/products/${encodeURIComponent(idOrSlug)}`);
      handleTrackSearchSafe(keyword, 'SUGGESTION_CLICK');
      return;
    }

    if (source === 'CATEGORY' && (item.categorySlug || item.categoryId)) {
      if (item.categorySlug) {
        router.push(`/category/${encodeURIComponent(item.categorySlug)}`);
      } else if (item.categoryId) {
        handleNavigateToProducts(keyword, item.categoryId);
      }
      handleTrackSearchSafe(keyword, 'SUGGESTION_CLICK', item.categoryId);
      return;
    }

    // Mặc định KEYWORD
    handleNavigateToProducts(keyword, item.categoryId);
    handleTrackSearchSafe(keyword, 'SUGGESTION_CLICK', item.categoryId);
  }, [router, handleTrackSearchSafe, handleNavigateToProducts]);

  const handleSearchSubmit = useCallback((value?: string) => {
    const keyword = (value ?? searchValue).trim();
    if (!keyword) return;
    handleNavigateToProducts(keyword);
    handleTrackSearchSafe(keyword, 'SUBMIT');
  }, [searchValue, handleNavigateToProducts, handleTrackSearchSafe]);

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  return {
    searchValue,
    searchOptions,
    handleSearchChange,
    handleSuggestionSelect,
    handleSearchSubmit,
  };
};