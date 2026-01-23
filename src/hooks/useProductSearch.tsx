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

  const handleTrackSearchSafe = useCallback(async (keyword: string, source: 'SUBMIT' | 'SUGGESTION_CLICK', categoryId?: string) => {
    try {
      const term = String(keyword || "").trim();
      if (!term) return;
      await searchService.trackSearch({ keyword: term, categoryId, source });
    } catch {}
  }, []);

  const handleNavigateToProducts = useCallback((keyword: string, categoryId?: string) => {
    const params = new URLSearchParams();
    const term = String(keyword || "").trim();
    if (term) params.set('keyword', term);
    if (categoryId) params.set('categoryId', categoryId);
    const qs = params.toString();
    router.push(qs ? `/products?${qs}` : '/products');
  }, [router]);

  const handleSearchChange = useCallback((value: any) => {
    const stringVal = String(value || ""); // Fix lỗi .trim()
    setSearchValue(stringVal);

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    const trimmed = stringVal.trim();
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
          label: null 
        }));
        setSearchOptions(options);
      } catch {
        setSearchOptions([]);
      }
    }, SEARCH_DEBOUNCE_MS);
  }, []);

  const handleSearchSubmit = useCallback((value?: string) => {
    const keyword = String(value ?? searchValue ?? "").trim();
    if (!keyword) return;
    handleNavigateToProducts(keyword);
    handleTrackSearchSafe(keyword, 'SUBMIT');
  }, [searchValue, handleNavigateToProducts, handleTrackSearchSafe]);

  const handleSuggestionSelect = useCallback((option: SearchOption) => {
    // Fix lỗi "Cannot read properties of undefined (reading 'source')"
    if (!option || !option.item) {
      handleSearchSubmit(option?.value);
      return;
    }

    const { value: keyword, item } = option;
    const source = (item.source || '').toUpperCase();

    setSearchValue(keyword);
    setSearchOptions([]);

    if (source === 'PRODUCT' && (item.productSlug || item.productId)) {
      router.push(`/products/${encodeURIComponent(item.productSlug || item.productId!)}`);
      handleTrackSearchSafe(keyword, 'SUGGESTION_CLICK');
      return;
    }

    if (source === 'CATEGORY' && (item.categorySlug || item.categoryId)) {
      if (item.categorySlug) {
        router.push(`/category/${encodeURIComponent(item.categorySlug)}`);
      } else {
        handleNavigateToProducts(keyword, item.categoryId);
      }
      handleTrackSearchSafe(keyword, 'SUGGESTION_CLICK', item.categoryId);
      return;
    }

    handleNavigateToProducts(keyword, item.categoryId);
    handleTrackSearchSafe(keyword, 'SUGGESTION_CLICK', item.categoryId);
  }, [router, handleTrackSearchSafe, handleNavigateToProducts, handleSearchSubmit]);

  return {
    searchValue,
    searchOptions,
    handleSearchChange,
    handleSuggestionSelect,
    handleSearchSubmit,
  };
};