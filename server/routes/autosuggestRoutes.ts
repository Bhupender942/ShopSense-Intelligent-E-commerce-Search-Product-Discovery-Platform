import express from "express";
import {
  getSuggestions,
  trackSearch,
  getPopularQueries,
  searchProducts,
  getCategories,
  getRecentlySearched,
  getTestProducts,
  analyzeQuery,
} from "../controllers/autosuggestController";
import { processSearchQuery, getSynonymsForCategory } from "../utils/synonyms";

const router = express.Router();

// GET /api/autosuggest/suggestions?q=query&limit=8&category=electronics
router.get("/suggestions", getSuggestions);

// POST /api/autosuggest/track
router.post("/track", trackSearch);

// GET /api/autosuggest/popular?category=electronics&limit=10&type=brand
router.get("/popular", getPopularQueries);

// GET /api/autosuggest/search?q=mobile&category=electronics&page=1&limit=24
router.get("/search", searchProducts);

// GET /api/autosuggest/categories
router.get("/categories", getCategories);

// GET /api/autosuggest/recent-searches
router.get("/recent-searches", getRecentlySearched);

// GET /api/autosuggest/test-products (for debugging)
router.get("/test-products", getTestProducts);

// GET /api/autosuggest/analyze-query?q=sneakers for men
router.get("/analyze-query", analyzeQuery);

// GET /api/autosuggest/test-synonyms?query=shoes (for testing synonyms)
router.get("/test-synonyms", (req, res) => {
  const { query, category } = req.query;

  if (query) {
    const processed = processSearchQuery(query as string);
    res.json({
      original: query,
      processed: processed,
      isSynonym: query !== processed,
    });
  } else if (category) {
    const synonyms = getSynonymsForCategory(category as string);
    res.json({
      category: category,
      synonyms: synonyms,
    });
  } else {
    res.json({
      message: "Use ?query=shoes or ?category=footwear to test synonyms",
    });
  }
});

export default router;
