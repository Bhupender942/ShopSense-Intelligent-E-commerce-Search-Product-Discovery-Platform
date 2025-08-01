import { useState, useEffect, useCallback } from 'react';
import { recentSearchesService } from '@/services/recentSearches';

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const getRecentSearches = useCallback(() => {
    const searches = recentSearchesService.getRecentSearches();
    setRecentSearches(searches);
    return searches;
  }, []);

  const addRecentSearch = useCallback((query: string) => {
    recentSearchesService.addRecentSearch(query);
    getRecentSearches(); // Refresh the state
  }, [getRecentSearches]);

  const clearRecentSearches = useCallback(() => {
    recentSearchesService.clearRecentSearches();
    setRecentSearches([]);
  }, []);

  // Load recent searches on mount
  useEffect(() => {
    getRecentSearches();
  }, [getRecentSearches]);

  return {
    recentSearches,
    getRecentSearches,
    addRecentSearch,
    clearRecentSearches
  };
} 