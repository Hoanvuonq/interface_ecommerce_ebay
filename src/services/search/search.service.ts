import { request } from "@/utils/axios.customize";
import { ApiResponse } from "@/api/_types/api.types";
// =========================
// Search Suggestion + Tracking APIs
// Backend base: /api/v1/search (axios baseURL already includes /api)
// =========================

const API_ENDPOINT_SEARCH = "v1/search";

export interface SuggestionItemDTO {
  keyword: string;
  searchCount?: number;
  source?: "KEYWORD" | "PRODUCT" | "CATEGORY" | string;
  productId?: string;
  productSlug?: string;
  categoryId?: string;
  categorySlug?: string;
  rankScore?: number;
  position?: number;
}

export interface SearchSuggestionResponseDTO {
  suggestions: SuggestionItemDTO[];
  requestId: string;
  count: number;
}

export interface TrackSearchRequestDTO {
  keyword: string;
  categoryId?: string;
  source?: "SUBMIT" | "SUGGESTION_CLICK";
}

export const searchService = {
  /**
   * Get autocomplete search suggestions.
   * Maps to GET /api/v1/search/suggestions?q=&limit=&categoryId=
   */
  async getSuggestions(params: {
    q: string;
    limit?: number;
    categoryId?: string;
  }) {
    const res = await request<ApiResponse<SearchSuggestionResponseDTO>>({
      method: "GET",
      url: `/${API_ENDPOINT_SEARCH}/suggestions`,
      params: {
        q: params.q,
        limit: params.limit ?? 10,
        categoryId: params.categoryId,
      },
    });

    // Backend ApiResponse wrapper: { code, success, message, data }
    if (res && typeof res === "object" && "data" in res) {
      return (res as any).data as SearchSuggestionResponseDTO;
    }

    // Fallback in case interceptor already unwrapped data
    return res as unknown as SearchSuggestionResponseDTO;
  },

  /**
   * Get hot search keywords for header (independent of current query).
   * Maps to GET /api/v1/search/hot?limit=&categoryId=
   */
  async getHot(params?: { limit?: number; categoryId?: string }) {
    const res = await request<ApiResponse<SearchSuggestionResponseDTO>>({
      method: "GET",
      url: `/${API_ENDPOINT_SEARCH}/hot`,
      params: {
        limit: params?.limit ?? 10,
        categoryId: params?.categoryId,
      },
    });

    if (res && typeof res === "object" && "data" in res) {
      return (res as any).data as SearchSuggestionResponseDTO;
    }

    return res as unknown as SearchSuggestionResponseDTO;
  },

  /**
   * Track a search keyword when user submits search or clicks suggestion.
   * Maps to POST /api/v1/search/track
   */
  async trackSearch(payload: TrackSearchRequestDTO) {
    return request<ApiResponse<void>>({
      method: "POST",
      url: `/${API_ENDPOINT_SEARCH}/track`,
      data: payload,
    });
  },
};


