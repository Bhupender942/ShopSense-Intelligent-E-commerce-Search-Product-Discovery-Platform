import { Request, Response } from "express";
import { 
  getAutosuggestResults, 
  trackSearchAnalytics, 
  getTrendingSearches,
  getCategorySuggestions 
} from "../utils/autosuggest";
import SearchSuggestion from "../models/SearchSuggestion";
import Product from "../models/Products";

export const getSuggestions = async (req: Request, res: Response): Promise<void> => {
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
        suggestions: suggestions.map(s => ({
          query: s.query,
          type: s.type,
          category: s.category,
          isTypoCorrection: false,
          score: 0,
          metadata: s.metadata
        })),
        hasTypoCorrection: false,
        count: suggestions.length,
      });
      return;
    }

    const results = await getAutosuggestResults(query, Math.min(Number(limit), 20));

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
      hasTypoCorrection: false 
    });
  }
};

export const trackSearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, action, category } = req.body;

    if (!query || !action || !["search", "click"].includes(action)) {
      res.status(400).json({ message: "Valid query and action are required" });
      return;
    }

    await trackSearchAnalytics(query, action, category);
    res.status(200).json({ message: "Analytics tracked successfully" });
  } catch (error) {
    console.error("Error tracking search analytics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPopularQueries = async (req: Request, res: Response): Promise<void> => {
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

export const searchProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      q: query, 
      category, 
      brand, 
      minPrice, 
      maxPrice, 
      minRating,
      sortBy = "popularity_score",
      sortOrder = "desc",
      page = 1, 
      limit = 24 
    } = req.query;

    const filter: any = {};
    
    if (query && typeof query === "string") {
      filter.$text = { $search: query };
    }
    
    if (category && typeof category === "string") {
      filter.category = { $regex: category, $options: "i" };
    }
    
    if (brand && typeof brand === "string") {
      filter.brand = { $regex: brand, $options: "i" };
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (minRating) {
      filter.average_rating = { $gte: Number(minRating) };
    }

    const sort: any = {};
    sort[sortBy as string] = sortOrder === "desc" ? -1 : 1;

    const skip = (Number(page) - 1) * Number(limit);

    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Product.countDocuments(filter)
    ]);

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
        hasPrev: Number(page) > 1
      },
      filters: {
        query,
        category,
        brand,
        minPrice,
        maxPrice,
        minRating
      }
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          subcategories: { $addToSet: "$subcategory" },
          brands: { $addToSet: "$brand" },
          avgPrice: { $avg: "$price" },
          avgRating: { $avg: "$average_rating" }
        }
      },
      {
        $project: {
          category: "$_id",
          count: 1,
          subcategories: { $slice: ["$subcategories", 10] },
          brands: { $slice: ["$brands", 20] },
          avgPrice: { $round: ["$avgPrice", 2] },
          avgRating: { $round: ["$avgRating", 1] }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({ categories });
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};