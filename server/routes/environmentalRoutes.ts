import express from "express";
import {
  calculateProductEnvironmentalImpact,
  updateAllProductsEnvironmentalImpact,
  getEcoFriendlyProducts,
  getEnvironmentalImpactByCategory,
  getEnvironmentalComparison,
} from "../controllers/environmentalController";

const router = express.Router();

// Calculate environmental impact for a specific product
router.get("/product/:productId", calculateProductEnvironmentalImpact);

// Update environmental impact for all products
router.post("/update-all", updateAllProductsEnvironmentalImpact);

// Get eco-friendly products
router.get("/eco-friendly", getEcoFriendlyProducts);

// Get environmental impact by category
router.get("/category/:category", getEnvironmentalImpactByCategory);

// Compare environmental impact of multiple products
router.post("/compare", getEnvironmentalComparison);

export default router;
