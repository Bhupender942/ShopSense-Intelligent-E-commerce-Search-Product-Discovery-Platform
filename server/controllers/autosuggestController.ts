import { Request, Response } from "express";
import {
  getAutosuggestResults,
  trackSearchAnalytics,
  getTrendingSearches,
  getCategorySuggestions,
} from "../utils/autosuggest";
import { convertQueryToFilters } from "../utils/queryToFilter";
import { processSearchQuery } from "../utils/synonyms";
import SearchSuggestion from "../models/SearchSuggestion";
import Product from "../models/Products";
import User from "../models/User";
import mongoose from "mongoose";

// Define interface for authenticated request
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    name: string;
    email: string;
  };
}

export const getSuggestions = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { q: query, limit = 8, category } = req.query;

    if (!query || typeof query !== "string") {
      // Return trending or category suggestions if no query
      let suggestions = [];
      if (category && typeof category === "string") {
        suggestions = await getCategorySuggestions(category, Number(limit));
      } else {
        suggestions = await getTrendingSearches(Number(limit));
      }

      res.status(200).json({
        query: "",
        suggestions: suggestions.map((s) => ({
          query: s.query,
          type: s.type,
          category: s.category,
          isTypoCorrection: false,
          score: 0,
          metadata: s.metadata,
        })),
        hasTypoCorrection: false,
        count: suggestions.length,
      });
      return;
    }

    const results = await getAutosuggestResults(
      query,
      Math.min(Number(limit), 20),
    );

    res.status(200).json({
      query,
      suggestions: results.suggestions,
      hasTypoCorrection: results.hasTypoCorrection,
      count: results.suggestions.length,
    });
  } catch (error) {
    console.error("Error getting suggestions:", error);
    res.status(500).json({
      message: "Internal server error",
      suggestions: [],
      hasTypoCorrection: false,
    });
  }
};

export const trackSearch = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const { query, action, category } = req.body;
    const userId = req.user?.userId; // Using userId instead of id

    if (!query || !action || !["search", "click"].includes(action)) {
      res.status(400).json({ message: "Valid query and action are required" });
      return;
    }

    await trackSearchAnalytics(query, action, category);

    // If user is logged in and performing a search, save to recently searched
    if (userId && action === "search") {
      const updateData = {
        $push: {
          recentlySearched: {
            $each: [{ query, timestamp: new Date() }],
            $position: 0, // Add to beginning of array
            $slice: 10, // Keep only the 10 most recent searches
          },
        },
      };

      // Convert userId to ObjectId and use the mongoose model directly
      try {
        // @ts-ignore - Ignoring type issues with mongoose
        await User.updateOne({ _id: userId }, updateData);
      } catch (err) {
        console.error("Error updating user recent searches:", err);
      }
    }

    res.status(200).json({ message: "Analytics tracked successfully" });
  } catch (error) {
    console.error("Error tracking search analytics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPopularQueries = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { category, limit = 10, type } = req.query;

    const filter: any = { isActive: true };
    if (category && typeof category === "string") {
      filter.category = category.toLowerCase().replace(/\s+/g, "-");
    }
    if (type && typeof type === "string") {
      filter.type = type;
    }

    const popularQueries = await SearchSuggestion.find(filter)
      .sort({ searchCount: -1, quality: -1 })
      .limit(Number(limit))
      .select("query type category searchCount quality metadata")
      .lean();

    res.status(200).json({
      popularQueries,
      count: popularQueries.length,
    });
  } catch (error) {
    console.error("Error getting popular queries:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const searchProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      q: query,
      category,
      brand,
      minPrice,
      maxPrice,
      minRating,
      minDiscount,
      availability,
      gender,
      sortBy = "popularity_score",
      sortOrder = "desc",
      page = 1,
      limit = 24,
      use_nlp = "true", // New parameter to enable/disable NLP query understanding
    } = req.query;

    console.log("Search request:", {
      query,
      category,
      brand,
      minPrice,
      maxPrice,
      minRating,
      minDiscount,
      availability,
      gender,
      sortBy,
      sortOrder,
      page,
      limit,
      use_nlp,
    });

    const filter: any = {};

    // Handle text search
    if (query && typeof query === "string") {
      // Use text search if available, otherwise use regex
      try {
        filter.$text = { $search: processedQuery };
      } catch (error) {
        // Fallback to regex search if text index is not available
        filter.$or = [
          { title: { $regex: processedQuery, $options: "i" } },
          { brand: { $regex: processedQuery, $options: "i" } },
          { category: { $regex: processedQuery, $options: "i" } },
          { subcategory: { $regex: processedQuery, $options: "i" } },
          { tags: { $regex: processedQuery, $options: "i" } },
        ];
      }
    }

    // Handle category filter (support multiple categories)
    // Only apply if not already set by query understanding
    if (category && typeof category === "string" && !filter.category) {
      if (category.includes(",")) {
        // Multiple categories
        const categories = category.split(",").map((c) => c.trim());
        filter.category = { $in: categories };
      } else {
        filter.category = { $regex: category, $options: "i" };
      }
    }

    // Handle brand filter (support multiple brands)
    if (brand && typeof brand === "string") {
      if (brand.includes(",")) {
        // Multiple brands
        const brands = brand.split(",").map((b) => b.trim());
        filter.brand = { $in: brands };
      } else {
        filter.brand = { $regex: brand, $options: "i" };
      }
    }

    // Handle price filters
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Handle rating filter
    if (minRating) {
      filter.average_rating = { $gte: Number(minRating) };
    }

    // Handle discount filter
    if (minDiscount) {
      filter.discount_percentage = { $gte: Number(minDiscount) };
    }

    // Handle availability filter
    if (availability && typeof availability === "string") {
      if (availability.includes(",")) {
        // Multiple availability options
        const availabilities = availability.split(",").map((a) => a.trim());
        filter.availability = { $in: availabilities };
      } else {
        filter.availability = { $regex: availability, $options: "i" };
      }
    }

    // Handle gender filter (if not already set by query understanding)
    if (gender && typeof gender === "string" && !filter.gender) {
      if (gender.includes(",")) {
        // Multiple genders
        const genders = gender.split(",").map((g) => g.trim());
        filter.gender = { $in: genders };
      } else {
        filter.gender = { $regex: gender, $options: "i" };
      }
    }

    console.log("MongoDB filter:", JSON.stringify(filter, null, 2));

    const sort: any = {};
    sort[sortBy as string] = sortOrder === "desc" ? -1 : 1;

    const skip = (Number(page) - 1) * Number(limit);

    // Execute search with better error handling
    let products, totalCount;
    try {
      [products, totalCount] = await Promise.all([
        Product.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(Number(limit))
          .select(
            "product_id title brand category subcategory gender price original_price discount_percentage average_rating rating_count availability images popularity_score date_added tags description",
          )
          .lean(),
        Product.countDocuments(filter),
      ]);
    } catch (dbError) {
      console.error("Database search error:", dbError);
      // Fallback to simple search if text search fails
      if (query && typeof query === "string") {
        const fallbackFilter = {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { brand: { $regex: query, $options: "i" } },
            { category: { $regex: query, $options: "i" } },
          ],
        };

        [products, totalCount] = await Promise.all([
          Product.find(fallbackFilter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .select(
              "product_id title brand category subcategory gender price original_price discount_percentage average_rating rating_count availability images popularity_score date_added tags description",
            )
            .lean(),
          Product.countDocuments(fallbackFilter),
        ]);
      } else {
        throw dbError;
      }
    }

    console.log(`Found ${products.length} products out of ${totalCount} total`);

    // Track search analytics
    if (query && typeof query === "string") {
      await trackSearchAnalytics(query, "search", category as string);
    }

    res.status(200).json({
      products,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalCount / Number(limit)),
        totalProducts: totalCount,
        hasNext: skip + Number(limit) < totalCount,
        hasPrev: Number(page) > 1,
      },
      filters: {
        query,
        category,
        brand,
        minPrice,
        maxPrice,
        minRating,
        minDiscount,
        availability,
        gender,
        sortBy,
        sortOrder,
      },
      queryUnderstanding: usingDerivedFilters
        ? {
            inferredFilters,
            inferredIntent,
            usingDerivedFilters,
          }
        : undefined,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({
      message: "Error searching products",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getCategories = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          subcategories: { $addToSet: "$subcategory" },
          brands: { $addToSet: "$brand" },
          avgPrice: { $avg: "$price" },
          avgRating: { $avg: "$average_rating" },
        },
      },
      {
        $project: {
          category: "$_id",
          count: 1,
          subcategories: { $slice: ["$subcategories", 10] },
          brands: { $slice: ["$brands", 20] },
          avgPrice: { $round: ["$avgPrice", 2] },
          avgRating: { $round: ["$avgRating", 1] },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({ categories });
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRecentlySearched = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId; // Using userId instead of id

    if (!userId) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    // Find user with explicit cast
    let user;
    try {
      // @ts-ignore - Ignoring type issues with mongoose
      user = await User.findOne({ _id: userId }).exec();
    } catch (err) {
      console.error("Error finding user:", err);
      res.status(500).json({ message: "Error retrieving user data" });
      return;
    }

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      recentlySearched: user.recentlySearched || [],
    });
  } catch (error) {
    console.error("Error getting recently searched terms:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTestProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log("Testing product database connection...");

    // Get total count
    const totalCount = await Product.countDocuments();
    console.log(`Total products in database: ${totalCount}`);

    // Get a few sample products
    const sampleProducts = await Product.find({})
      .limit(5)
      .select("product_id title brand category price")
      .lean();

    console.log("Sample products:", sampleProducts);

    res.status(200).json({
      totalCount,
      sampleProducts,
      message: "Database connection test successful",
    });
  } catch (error) {
    console.error("Error testing products:", error);
    res.status(500).json({
      message: "Error testing products",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// New endpoint for analyzing queries and converting them to structured filters
export const analyzeQuery = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { q: query } = req.query;

    if (!query || typeof query !== "string") {
      res.status(400).json({
        message: "Valid query parameter is required",
        example: "/api/analyze-query?q=sneakers for men",
      });
      return;
    }

    const analysis = await convertQueryToFilters(query);

    // Get sample matching products based on the inferred filters
    const filters: any = {};

    if (analysis.filters.category) {
      filters.category = { $regex: analysis.filters.category, $options: "i" };
    }

    if (analysis.filters.subcategory) {
      filters.subcategory = {
        $regex: analysis.filters.subcategory,
        $options: "i",
      };
    }

    if (analysis.filters.gender) {
      filters.gender = { $regex: analysis.filters.gender, $options: "i" };
    }

    // Apply price range filter if available
    if (analysis.filters.priceRange === "low") {
      // For budget/low price range, filter to products under 20,000
      filters.price = { $lte: 20000 };
    } else if (analysis.filters.priceRange === "high") {
      // For premium/high price range, filter to products above 50,000
      filters.price = { $gte: 50000 };
    }

    // Get sample matching products
    const sampleProducts = await Product.find(filters)
      .limit(5)
      .select("product_id title brand category subcategory gender price")
      .lean();

    res.status(200).json({
      query,
      analysis,
      matchingFilters: filters,
      sampleProducts,
    });
  } catch (error) {
    console.error("Error analyzing query:", error);
    res.status(500).json({
      message: "Error analyzing query",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
