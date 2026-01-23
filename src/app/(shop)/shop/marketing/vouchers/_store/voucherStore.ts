import { create } from "zustand";
import { SearchVoucherTemplatesResponse } from "@/app/(main)/shop/_types/dto/shop.voucher.dto";

interface CacheEntry {
  data: SearchVoucherTemplatesResponse | null;
  timestamp: number;
  loading: boolean;
}

interface VoucherStore {
  // Cache: key = "shop" | "platform" | "all"
  cache: Record<string, CacheEntry>;
  
  // Set cache
  setCache: (key: string, data: SearchVoucherTemplatesResponse) => void;
  
  // Get cache (with TTL check)
  getCache: (key: string, ttlMs?: number) => SearchVoucherTemplatesResponse | null;
  
  // Check if cache is fresh
  isCacheFresh: (key: string, ttlMs?: number) => boolean;
  
  // Set loading state
  setLoading: (key: string, loading: boolean) => void;
  
  // Clear specific cache
  clearCache: (key: string) => void;
  
  // Clear all cache
  clearAllCache: () => void;
  
  // Get loading state
  isLoading: (key: string) => boolean;
}

// Default TTL: 5 minutes
const DEFAULT_TTL_MS = 5 * 60 * 1000;

export const useVoucherStore = create<VoucherStore>((set, get) => ({
  cache: {},
  
  setCache: (key: string, data: SearchVoucherTemplatesResponse) => {
    set((state) => ({
      cache: {
        ...state.cache,
        [key]: {
          data,
          timestamp: Date.now(),
          loading: false,
        },
      },
    }));
  },
  
  getCache: (key: string, ttlMs = DEFAULT_TTL_MS) => {
    const { cache } = get();
    const entry = cache[key];
    
    if (!entry) return null;
    
    // Check if cache expired
    if (Date.now() - entry.timestamp > ttlMs) {
      return null;
    }
    
    return entry.data;
  },
  
  isCacheFresh: (key: string, ttlMs = DEFAULT_TTL_MS) => {
    const { cache } = get();
    const entry = cache[key];
    
    if (!entry || !entry.data) return false;
    if (entry.loading) return false;
    
    // Check if cache expired
    return Date.now() - entry.timestamp <= ttlMs;
  },
  
  setLoading: (key: string, loading: boolean) => {
    set((state) => ({
      cache: {
        ...state.cache,
        [key]: {
          ...state.cache[key],
          loading,
        },
      },
    }));
  },
  
  isLoading: (key: string) => {
    const { cache } = get();
    return cache[key]?.loading ?? false;
  },
  
  clearCache: (key: string) => {
    set((state) => {
      const newCache = { ...state.cache };
      delete newCache[key];
      return { cache: newCache };
    });
  },
  
  clearAllCache: () => {
    set({ cache: {} });
  },
}));
