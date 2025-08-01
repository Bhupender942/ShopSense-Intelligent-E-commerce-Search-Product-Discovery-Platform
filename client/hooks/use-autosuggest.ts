import { useState, useEffect, useCallback } from "react";

interface Suggestion {
  query: string;
  type: "product" | "brand" | "category" | "subcategory" | "recent";
  category: string;
  isTypoCorrection: boolean;
  score: number;
  metadata: {
    productCount?: number;
    avgRating?: number;
    avgPrice?: number;
    brands?: string[];
  };
}

export interface RecentSearchTerm {
  query: string;
  timestamp: string;
}

interface AutosuggestResult {
  suggestions: Suggestion[];
  hasTypoCorrection: boolean;
  isLoading: boolean;
  error: string | null;
}

const API_URL = import.meta.env.VITE_API_URL || "/api";

// Hook to get recently searched terms
export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<RecentSearchTerm[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentSearches = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/autosuggest/recent-searches`, {
        credentials: "include", // Important for sending cookies/auth tokens
      });

      if (response.status === 401) {
        // User is not authenticated
        setRecentSearches([]);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch recent searches");
      }

      const data = await response.json();
      setRecentSearches(data.recentlySearched || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch recent searches",
      );
      setRecentSearches([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { recentSearches, isLoading, error, fetchRecentSearches };
}

export function useAutosuggest(
  query: string,
  category?: string,
  debounceMs: number = 300,
): AutosuggestResult {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [hasTypoCorrection, setHasTypoCorrection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = useCallback(
    async (searchQuery: string, searchCategory?: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.append("q", searchQuery);
        if (searchCategory) params.append("category", searchCategory);
        params.append("limit", "8");

        const response = await fetch(
          `${API_URL}/autosuggest/suggestions?${params}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch suggestions");
        }

        const data = await response.json();
        setSuggestions(data.suggestions || []);
        setHasTypoCorrection(data.hasTypoCorrection || false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch suggestions",
        );
        setSuggestions([]);
        setHasTypoCorrection(false);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(query, category);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, category, debounceMs, fetchSuggestions]);

  return { suggestions, hasTypoCorrection, isLoading, error };
}

// Enhanced analytics tracking
export async function trackSearchAnalytics(
  query: string,
  action: "search" | "click",
  category?: string,
) {
  try {
    await fetch(`${API_URL}/autosuggest/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, action, category }),
    });
  } catch (error) {
    console.error("Failed to track analytics:", error);
  }
}

// Product search hook
export function useProductSearch() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchProducts = useCallback(
    async (searchParams: {
      query?: string;
      category?: string;
      brand?: string;
      minPrice?: number;
      maxPrice?: number;
      minRating?: number;
      sortBy?: string;
      sortOrder?: string;
      page?: number;
      limit?: number;
      use_nlp?: boolean;
    }) => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        Object.entries(searchParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });

        // Enable query understanding by default
        if (
          searchParams.query &&
          params.has("query") &&
          !params.has("use_nlp")
        ) {
          params.append("use_nlp", "true");
        }

        const url = `${API_URL}/autosuggest/search?${params}`;
        console.log("Making API request to:", url);

        const response = await fetch(url);

        console.log("API response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API error response:", errorText);
          throw new Error("Failed to search products");
        }

        const data = await response.json();
        console.log("API response data:", data);
        setProducts(data.products || []);

        // Include query understanding data in the pagination object
        const paginationWithQueryUnderstanding = {
          ...data.pagination,
          queryUnderstanding: data.queryUnderstanding,
        };

        setPagination(paginationWithQueryUnderstanding);
      } catch (err) {
        console.error("Error in searchProducts:", err);
        setError(
          err instanceof Error ? err.message : "Failed to search products",
        );
        setProducts([]);
        setPagination(null);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { products, pagination, isLoading, error, searchProducts };
}
