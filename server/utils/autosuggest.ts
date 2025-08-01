import SearchSuggestion from "../models/SearchSuggestion";
import Product from "../models/Products";
import { processSearchQuery } from "./synonyms";

// Server-side Trie implementation for fast prefix matching
class TrieNode {
  children: Record<string, TrieNode> = {};
  isEndOfWord: boolean = false;
  suggestions: string[] = [];
  scores: number[] = [];
}

class AutosuggestTrie {
  private root: TrieNode = new TrieNode();
  private maxSuggestions: number = 10;

  insert(word: string, score: number = 0): void {
    let node = this.root;
    const cleanWord = word.toLowerCase().trim();

    for (const char of cleanWord) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];

      // Add suggestion to intermediate nodes for prefix matching
      if (!node.suggestions.includes(cleanWord)) {
        node.suggestions.push(cleanWord);
        node.scores.push(score);

        // Keep only top suggestions, sorted by score
        const combined = node.suggestions.map((s, i) => ({
          suggestion: s,
          score: node.scores[i],
        }));
        combined.sort((a, b) => b.score - a.score);
        node.suggestions = combined
          .slice(0, this.maxSuggestions)
          .map((c) => c.suggestion);
        node.scores = combined
          .slice(0, this.maxSuggestions)
          .map((c) => c.score);
      }
    }
    node.isEndOfWord = true;
  }

  findSuggestions(prefix: string, limit: number = 8): string[] {
    let node = this.root;
    const cleanPrefix = prefix.toLowerCase().trim();

    for (const char of cleanPrefix) {
      if (!node.children[char]) return [];
      node = node.children[char];
    }

    return node.suggestions.slice(0, limit);
  }

  clear(): void {
    this.root = new TrieNode();
  }
}

// Global Trie instance for caching
let suggestionTrie = new AutosuggestTrie();
let lastCacheUpdate = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Enhanced Levenshtein distance with optimizations
function levenshteinDistance(str1: string, str2: string): number {
  if (str1.length < str2.length) return levenshteinDistance(str2, str1);
  if (str2.length === 0) return str1.length;

  let previousRow = Array.from({ length: str2.length + 1 }, (_, i) => i);

  for (let i = 0; i < str1.length; i++) {
    let currentRow = [i + 1];
    for (let j = 0; j < str2.length; j++) {
      let insertions = previousRow[j + 1] + 1;
      let deletions = currentRow[j] + 1;
      let substitutions = previousRow[j] + (str1[i] !== str2[j] ? 1 : 0);
      currentRow.push(Math.min(insertions, deletions, substitutions));
    }
    previousRow = currentRow;
  }
  return previousRow[str2.length];
}

// Enhanced scoring with multiple factors and category prioritization
function calculateSuggestionScore(
  suggestion: any,
  prefix: string,
  isExactMatch: boolean,
  hasProductData: boolean = false,
): number {
  let score = 0;
  // Guard against undefined query
  if (!suggestion || !suggestion.query) {
    return 0;
  }
  const query = suggestion.query.toLowerCase();
  const cleanPrefix = prefix?.toLowerCase() || "";

  // Exact prefix match gets highest priority
  if (query.startsWith(cleanPrefix)) {
    score += 1000;
    // Bonus for exact word boundary matches
    if (query.split(" ").some((word) => word.startsWith(cleanPrefix))) {
      score += 200;
    }
  }

  // Category-based priority scoring (highest priority categories)
  const priorityCategories = {
    shoes: 1200,
    clothing: 1200,
    mobile: 1200,
    toys: 1200,
    electronics: 1000,
    fashion: 1000,
    footwear: 1000,
    smartphones: 1000,
    gaming: 1000,
    sports: 900,
    home: 800,
    books: 700,
    automotive: 600,
    beauty: 600,
    health: 500,
  };

  const suggestionCategory = suggestion.category?.toLowerCase() || "";
  const categoryScore =
    priorityCategories[suggestionCategory as keyof typeof priorityCategories] ||
    500;
  score += categoryScore;

  // Type-based scoring with enhanced weights
  const typeScores = {
    category: 900,
    brand: 700,
    subcategory: 500,
    product: 300,
  };
  score += typeScores[suggestion.type as keyof typeof typeScores] || 100;

  // Popularity-based scoring (using popularity_score from products)
  if (suggestion.metadata?.popularity_score) {
    score += Math.min(suggestion.metadata.popularity_score * 10, 500);
  }

  // Search analytics scoring
  if (suggestion.searchCount) {
    score += Math.min(suggestion.searchCount * 3, 300); // Cap at 300
  }

  if (suggestion.ctr) {
    score += suggestion.ctr * 400;
  }

  if (suggestion.quality) {
    score += suggestion.quality * 250;
  }

  // Metadata-based scoring
  if (suggestion.metadata?.productCount) {
    score += Math.log(suggestion.metadata.productCount + 1) * 15;
  }

  if (suggestion.metadata?.avgRating && suggestion.metadata.avgRating > 0) {
    score += suggestion.metadata.avgRating * 25;
  }

  // Length penalties and bonuses
  const lengthDiff = Math.abs(query.length - cleanPrefix.length);
  if (lengthDiff <= 3) {
    score += 50; // Bonus for similar length
  } else {
    score -= lengthDiff * 5; // Penalty for very different lengths
  }

  // Popularity boost for shorter, common queries
  if (query.length <= 10 && suggestion.searchCount > 20) {
    score += 100;
  }

  // Fresh product data bonus
  if (hasProductData) {
    score += 150;
  }

  // Typo correction penalty
  if (suggestion.isTypoCorrection) {
    score -= 200;
  }

  return Math.max(0, score);
}

// Build and cache suggestions in Trie
async function buildSuggestionCache(): Promise<void> {
  const now = Date.now();
  if (now - lastCacheUpdate < CACHE_DURATION && suggestionTrie) {
    return; // Cache is still fresh
  }

  suggestionTrie.clear();

  try {
    // Get all active suggestions
    const suggestions = await SearchSuggestion.find({ isActive: true })
      .sort({ quality: -1, searchCount: -1 })
      .limit(5000)
      .lean();

    // Get popular product titles and brands
    const products = await Product.find({})
      .sort({ popularity_score: -1 })
      .limit(1000)
      .select(
        "title brand category subcategory popularity_score average_rating",
      )
      .lean();

    // Add suggestions to Trie
    suggestions.forEach((suggestion) => {
      const score = calculateSuggestionScore(
        suggestion,
        suggestion.query,
        true,
      );
      suggestionTrie.insert(suggestion.query, score);
    });

    // Add product data to Trie
    products.forEach((product) => {
      // Only process products with valid title and brand
      if (product && product.title) {
        const titleScore = calculateSuggestionScore(
          {
            query: product.title,
            type: "product",
            category: product.category?.toLowerCase().replace(/\s+/g, "-"),
            searchCount: Math.floor((product.popularity_score || 0) * 2),
            quality: (product.popularity_score || 0) / 10,
            metadata: {
              avgRating: product.average_rating,
              popularity_score: product.popularity_score || 0,
              productCount: 1,
            },
          },
          product.title,
          true,
          true,
        );

        suggestionTrie.insert(product.title.toLowerCase(), titleScore);
      }

      if (product && product.brand) {
        const brandScore = calculateSuggestionScore(
          {
            query: product.brand,
            type: "brand",
            category: product.category?.toLowerCase().replace(/\s+/g, "-"),
            searchCount: Math.floor((product.popularity_score || 0) * 3),
            quality: (product.popularity_score || 0) / 10,
            metadata: {
              popularity_score: product.popularity_score || 0,
              avgRating: product.average_rating,
            },
          },
          product.brand,
          true,
          true,
        );

        suggestionTrie.insert(product.brand.toLowerCase(), brandScore);
      }
    });

    lastCacheUpdate = now;
  } catch (error) {
    console.error("Error building suggestion cache:", error);
  }
}

// Enhanced autosuggest with Trie and improved logic
export async function getAutosuggestResults(
  prefix: string,
  limit: number = 8,
): Promise<{
  suggestions: Array<{
    query: string;
    type: string;
    category: string;
    isTypoCorrection: boolean;
    score: number;
    metadata: any;
  }>;
  hasTypoCorrection: boolean;
}> {
  if (!prefix || prefix.length < 1) {
    // Return trending suggestions for empty query
    const trending = await getTrendingSearches(limit);
    return {
      suggestions: trending
        .filter((t) => t && t.query && t.type && t.category)
        .map((t) => ({
          query: t.query,
          type: t.type || "product",
          category: t.category || "other",
          isTypoCorrection: false,
          score: 0,
          metadata: t.metadata || {},
        })),
      hasTypoCorrection: false,
    };
  }

  // Process prefix with synonyms
  const processedPrefix = processSearchQuery(prefix.trim().toLowerCase());
  const cleanPrefix = processedPrefix;

  // Build/refresh cache
  await buildSuggestionCache();

  // Get Trie suggestions for fast prefix matching
  const trieSuggestions = suggestionTrie.findSuggestions(
    cleanPrefix,
    limit * 2,
  );

  // Get database suggestions for comprehensive results
  const [exactMatches, fuzzyMatches, productMatches] = await Promise.all([
    // Exact prefix matches
    SearchSuggestion.find({
      query: {
        $regex: `^${cleanPrefix.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}`,
        $options: "i",
      },
      isActive: true,
    })
      .limit(limit)
      .lean(),

    // Text search for typo correction
    SearchSuggestion.find({
      $text: { $search: cleanPrefix },
      isActive: true,
    })
      .limit(limit)
      .lean(),

    // Direct product matches
    Product.find({
      $or: [
        {
          title: {
            $regex: cleanPrefix.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
            $options: "i",
          },
        },
        {
          brand: {
            $regex: `^${cleanPrefix.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}`,
            $options: "i",
          },
        },
        {
          category: {
            $regex: `^${cleanPrefix.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}`,
            $options: "i",
          },
        },
        // Use MongoDB $regex instead of RegExp constructor to avoid issues with special characters
        {
          tags: {
            $regex: cleanPrefix.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
            $options: "i",
          },
        },
      ],
    })
      .limit(8)
      .select(
        "title brand category subcategory popularity_score average_rating",
      )
      .sort({ popularity_score: -1 })
      .lean(),
  ]);

  // If we have few exact matches and short query, do aggressive fuzzy matching
  let levenshteinMatches: any[] = [];
  if (
    exactMatches.length < 3 &&
    cleanPrefix.length >= 2 &&
    cleanPrefix.length <= 6
  ) {
    const allSuggestions = await SearchSuggestion.find({ isActive: true })
      .sort({ quality: -1, searchCount: -1 })
      .limit(200)
      .select("query type category searchCount quality metadata")
      .lean();

    // Find close matches using Levenshtein distance
    const threshold = Math.max(1, Math.floor(cleanPrefix.length * 0.4)); // More aggressive threshold
    levenshteinMatches = allSuggestions
      .filter((suggestion) => {
        const distance = levenshteinDistance(
          cleanPrefix,
          suggestion.query.toLowerCase(),
        );
        return distance <= threshold && distance > 0;
      })
      .slice(0, 5); // Limit to top 5 fuzzy matches
  }

  // Convert product matches to suggestion format
  const productSuggestions = productMatches.map((product) => ({
    query: product.title.toLowerCase(),
    type: "product",
    category: product.category.toLowerCase().replace(/\s+/g, "-"),
    searchCount: Math.floor(product.popularity_score * 2) || 1,
    clickCount: Math.floor(product.popularity_score) || 1,
    ctr: 0.5,
    quality: Math.min(1, product.popularity_score / 10),
    isActive: true,
    metadata: {
      productCount: 1,
      avgRating: product.average_rating,
      popularity_score: product.popularity_score || 0,
    },
  }));

  // Combine all sources and remove duplicates
  const allMatches = new Map();

  // Add database matches
  [...exactMatches, ...productSuggestions].forEach((match) => {
    if (!allMatches.has(match.query)) {
      allMatches.set(match.query, match);
    }
  });

  // Add Trie suggestions that aren't already included
  for (const trieSugg of trieSuggestions) {
    if (!allMatches.has(trieSugg)) {
      // Find in database for complete data
      const dbMatch = await SearchSuggestion.findOne({
        query: trieSugg,
        isActive: true,
      }).lean();

      if (dbMatch) {
        allMatches.set(trieSugg, dbMatch);
      }
    }
  }

  // Add fuzzy matches for typo correction
  fuzzyMatches.forEach((fuzzy) => {
    if (!allMatches.has(fuzzy.query)) {
      allMatches.set(fuzzy.query, fuzzy);
    }
  });

  // Add Levenshtein distance matches for aggressive fuzzy matching
  levenshteinMatches.forEach((match) => {
    if (!allMatches.has(match.query)) {
      allMatches.set(match.query, match);
    }
  });

  // Check for typos
  const allQueries = Array.from(allMatches.keys());
  const hasTypoCorrection =
    isPotentialTypo(cleanPrefix, allQueries) || levenshteinMatches.length > 0;

  // Calculate scores and sort
  const scoredSuggestions = Array.from(allMatches.values())
    .filter((suggestion) => suggestion && suggestion.query) // Filter out invalid suggestions
    .map((suggestion) => {
      try {
        const isExactMatch = suggestion.query
          .toLowerCase()
          .startsWith(cleanPrefix);
        const isLevenshteinMatch = levenshteinMatches.some(
          (lm) => lm && lm.query === suggestion.query,
        );
        const score = calculateSuggestionScore(
          suggestion,
          cleanPrefix,
          isExactMatch,
        );

        return {
          query: suggestion.query,
          type: suggestion.type || "product",
          category: suggestion.category || "other",
          isTypoCorrection:
            !isExactMatch && (hasTypoCorrection || isLevenshteinMatch),
          score: isLevenshteinMatch ? score + 50 : score, // Boost Levenshtein matches slightly
          metadata: suggestion.metadata || {},
        };
      } catch (err) {
        console.error("Error processing suggestion:", err, suggestion);
        // Return a safe default value
        return {
          query: String(suggestion.query || ""),
          type: "product",
          category: "other",
          isTypoCorrection: false,
          score: 0,
          metadata: {},
        };
      }
    });

  // Sort by score and return top results
  const topSuggestions = scoredSuggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return {
    suggestions: topSuggestions,
    hasTypoCorrection,
  };
}

// Improved typo detection
function isPotentialTypo(query: string, suggestions: string[]): boolean {
  // Validate input parameters
  if (
    !query ||
    query.length <= 2 ||
    !suggestions ||
    !Array.isArray(suggestions)
  ) {
    return false;
  }

  const threshold = Math.max(1, Math.floor(query.length * 0.25));
  let hasCloseMatch = false;

  for (const suggestion of suggestions.slice(0, 10)) {
    // Check top 10 only
    if (!suggestion) continue;
    try {
      const distance = levenshteinDistance(
        query.toLowerCase(),
        String(suggestion).toLowerCase(),
      );
      if (distance <= threshold && distance > 0) {
        hasCloseMatch = true;
        break;
      }
    } catch (err) {
      console.error("Error in typo detection:", err);
    }
  }

  return hasCloseMatch;
}

// Enhanced analytics tracking with better categorization
export async function trackSearchAnalytics(
  query: string,
  action: "search" | "click",
  category?: string,
): Promise<void> {
  const cleanQuery = query.trim().toLowerCase();

  try {
    const suggestion = await SearchSuggestion.findOne({ query: cleanQuery });

    if (suggestion) {
      // Update existing suggestion
      if (action === "search") {
        suggestion.searchCount += 1;
      } else if (action === "click") {
        suggestion.clickCount += 1;
      }

      suggestion.ctr =
        suggestion.searchCount > 0
          ? suggestion.clickCount / suggestion.searchCount
          : 0;
      suggestion.quality = Math.min(
        1,
        suggestion.ctr * 1.5 + Math.min(suggestion.searchCount / 100, 0.5),
      );

      await suggestion.save();
    } else {
      // Create new suggestion entry
      const [productCount, products] = await Promise.all([
        Product.countDocuments({
          $or: [
            {
              title: {
                $regex: cleanQuery.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
                $options: "i",
              },
            },
            {
              brand: {
                $regex: cleanQuery.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
                $options: "i",
              },
            },
            {
              category: {
                $regex: cleanQuery.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
                $options: "i",
              },
            },
            {
              tags: {
                $regex: cleanQuery.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
                $options: "i",
              },
            },
          ],
        }),
        Product.find({
          $or: [
            {
              title: {
                $regex: cleanQuery.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
                $options: "i",
              },
            },
            {
              brand: {
                $regex: cleanQuery.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
                $options: "i",
              },
            },
            {
              category: {
                $regex: cleanQuery.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
                $options: "i",
              },
            },
          ],
        })
          .limit(5)
          .select("category brand average_rating price")
          .lean(),
      ]);

      if (productCount > 0) {
        // Determine suggestion type and category
        let suggestionType = "product";
        let suggestionCategory = category || "other";

        if (products.length > 0) {
          const categories = [...new Set(products.map((p) => p.category))];
          const brands = [...new Set(products.map((p) => p.brand))];

          if (
            brands.some((brand) => brand.toLowerCase().includes(cleanQuery))
          ) {
            suggestionType = "brand";
          } else if (
            categories.some((cat) => cat.toLowerCase().includes(cleanQuery))
          ) {
            suggestionType = "category";
          }

          suggestionCategory =
            categories[0]?.toLowerCase().replace(/\s+/g, "-") || "other";
        }

        const avgRating =
          products.length > 0
            ? products.reduce((sum, p) => sum + (p.average_rating || 0), 0) /
              products.length
            : 0;

        const avgPrice =
          products.length > 0
            ? products.reduce((sum, p) => sum + (p.price || 0), 0) /
              products.length
            : 0;

        await SearchSuggestion.create({
          query: cleanQuery,
          type: suggestionType,
          category: suggestionCategory,
          searchCount: action === "search" ? 1 : 0,
          clickCount: action === "click" ? 1 : 0,
          ctr: 0,
          quality: 0.5,
          metadata: {
            productCount,
            avgRating: Math.round(avgRating * 10) / 10,
            avgPrice: Math.round(avgPrice * 100) / 100,
            brands: [...new Set(products.map((p) => p.brand))].slice(0, 5),
          },
        });
      }
    }

    // Refresh cache periodically
    if (Math.random() < 0.1) {
      // 10% chance to refresh
      lastCacheUpdate = 0; // Force refresh on next request
    }
  } catch (error) {
    console.error("Error tracking search analytics:", error);
  }
}

// Get trending searches with enhanced filtering
export async function getTrendingSearches(limit: number = 10) {
  const trending = await SearchSuggestion.find({
    isActive: true,
    searchCount: { $gte: 3 },
    quality: { $gte: 0.3 },
  })
    .sort({
      searchCount: -1,
      quality: -1,
      updatedAt: -1,
    })
    .limit(limit)
    .select("query type category searchCount quality metadata")
    .lean();

  return trending;
}

// Get category-specific suggestions with improved scoring
export async function getCategorySuggestions(
  category: string,
  limit: number = 10,
) {
  const suggestions = await SearchSuggestion.find({
    category: category.toLowerCase().replace(/\s+/g, "-"),
    isActive: true,
    quality: { $gte: 0.2 },
  })
    .sort({ quality: -1, searchCount: -1 })
    .limit(limit)
    .select("query type searchCount quality metadata")
    .lean();

  return suggestions;
}

// Initialize some common suggestions for demo with priority categories
async function initializeCommonSuggestions(): Promise<void> {
  const commonTerms = [
    // High priority categories (shoes, clothing, mobile, toys)
    {
      query: "shoes",
      type: "category",
      category: "shoes",
      searchCount: 200,
      popularity_score: 95,
    },
    {
      query: "mobile",
      type: "category",
      category: "mobile",
      searchCount: 180,
      popularity_score: 90,
    },
    {
      query: "clothing",
      type: "category",
      category: "clothing",
      searchCount: 170,
      popularity_score: 85,
    },
    {
      query: "toys",
      type: "category",
      category: "toys",
      searchCount: 160,
      popularity_score: 80,
    },
    {
      query: "phone",
      type: "category",
      category: "mobile",
      searchCount: 150,
      popularity_score: 85,
    },
    {
      query: "smartphone",
      type: "category",
      category: "mobile",
      searchCount: 140,
      popularity_score: 80,
    },
    {
      query: "footwear",
      type: "category",
      category: "shoes",
      searchCount: 130,
      popularity_score: 75,
    },
    {
      query: "sneakers",
      type: "category",
      category: "shoes",
      searchCount: 120,
      popularity_score: 70,
    },
    {
      query: "shirt",
      type: "category",
      category: "clothing",
      searchCount: 110,
      popularity_score: 65,
    },
    {
      query: "dress",
      type: "category",
      category: "clothing",
      searchCount: 100,
      popularity_score: 60,
    },
    // Popular brands
    {
      query: "nike",
      type: "brand",
      category: "shoes",
      searchCount: 140,
      popularity_score: 85,
    },
    {
      query: "samsung",
      type: "brand",
      category: "mobile",
      searchCount: 180,
      popularity_score: 90,
    },
    {
      query: "iphone",
      type: "product",
      category: "mobile",
      searchCount: 200,
      popularity_score: 95,
    },
    {
      query: "adidas",
      type: "brand",
      category: "shoes",
      searchCount: 120,
      popularity_score: 75,
    },
    // Electronics
    {
      query: "laptop",
      type: "category",
      category: "electronics",
      searchCount: 100,
      popularity_score: 60,
    },
    {
      query: "headphones",
      type: "category",
      category: "electronics",
      searchCount: 90,
      popularity_score: 55,
    },
    // Gaming/Toys
    {
      query: "gaming",
      type: "category",
      category: "toys",
      searchCount: 80,
      popularity_score: 50,
    },
    {
      query: "lego",
      type: "brand",
      category: "toys",
      searchCount: 70,
      popularity_score: 45,
    },
  ];

  for (const term of commonTerms) {
    const existing = await SearchSuggestion.findOne({ query: term.query });
    if (!existing) {
      await SearchSuggestion.create({
        ...term,
        clickCount: Math.floor(term.searchCount * 0.3),
        ctr: 0.3,
        quality: 0.7,
        isActive: true,
        metadata: {
          productCount: Math.floor(Math.random() * 50) + 10,
          avgRating: 3.5 + Math.random() * 1.5,
          popularity_score: term.popularity_score || 50,
        },
      });
    }
  }
}

// Utility function to preload suggestions (call this on server startup)
export async function preloadSuggestionCache(): Promise<void> {
  try {
    await initializeCommonSuggestions();
    await buildSuggestionCache();
    console.log("Autosuggest cache preloaded successfully");
  } catch (error) {
    console.error("Error preloading suggestion cache:", error);
  }
}
