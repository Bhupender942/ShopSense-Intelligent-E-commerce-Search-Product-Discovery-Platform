const RECENT_SEARCHES_KEY = 'recentSearches';
const MAX_RECENT_SEARCHES = 10;

export interface RecentSearch {
  query: string;
  timestamp: number;
}

class RecentSearchesService {
  private getStoredSearches(): RecentSearch[] {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading recent searches from localStorage:', error);
      return [];
    }
  }

  private saveRecentSearches(searches: RecentSearch[]): void {
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    } catch (error) {
      console.error('Error saving recent searches to localStorage:', error);
    }
  }

  getRecentSearches(): string[] {
    const searches = this.getStoredSearches();
    return searches.map(search => search.query);
  }

  addRecentSearch(query: string): void {
    if (!query || !query.trim()) return;

    const trimmedQuery = query.trim();
    const searches = this.getStoredSearches();
    
    // Remove existing occurrence of the same query
    const filteredSearches = searches.filter(search => search.query !== trimmedQuery);
    
    // Add new search to the beginning
    const newSearch: RecentSearch = {
      query: trimmedQuery,
      timestamp: Date.now()
    };
    
    const updatedSearches = [newSearch, ...filteredSearches];
    
    // Keep only the most recent MAX_RECENT_SEARCHES
    const limitedSearches = updatedSearches.slice(0, MAX_RECENT_SEARCHES);
    
    this.saveRecentSearches(limitedSearches);
  }

  clearRecentSearches(): void {
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (error) {
      console.error('Error clearing recent searches from localStorage:', error);
    }
  }
}

export const recentSearchesService = new RecentSearchesService(); 