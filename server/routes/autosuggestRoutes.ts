import express from "express";
import {
  getSuggestions,
  trackSearch,
  getPopularQueries,
  searchProducts,
  getCategories,
} from "../controllers/autosuggestController";

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

export default router;