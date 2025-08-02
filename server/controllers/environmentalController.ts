import { Request, Response } from "express";
import Product from "../models/Products";
import {
  calculateEnvironmentalImpact,
  EnvironmentalMetrics,
} from "../utils/environmentalImpact";

export const calculateProductEnvironmentalImpact = async (
  req: Request,
  res: Response,
) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne({ product_id: productId });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const environmentalMetrics = calculateEnvironmentalImpact(
      product.specifications,
      product.category,
      product.brand,
    );

    // Update product with environmental metrics
    await Product.updateOne(
      { product_id: productId },
      { $set: { environmentalMetrics } },
    );

    res.json({
      success: true,
      environmentalMetrics,
      message: "Environmental impact calculated successfully",
    });
  } catch (error) {
    console.error("Error calculating environmental impact:", error);
    res.status(500).json({ error: "Failed to calculate environmental impact" });
  }
};

export const updateAllProductsEnvironmentalImpact = async (
  req: Request,
  res: Response,
) => {
  try {
    const products = await Product.find({});
    let updatedCount = 0;

    for (const product of products) {
      const environmentalMetrics = calculateEnvironmentalImpact(
        product.specifications,
        product.category,
        product.brand,
      );

      await Product.updateOne(
        { _id: product._id },
        { $set: { environmentalMetrics } },
      );

      updatedCount++;
    }

    res.json({
      success: true,
      message: `Environmental impact calculated for ${updatedCount} products`,
      updatedCount,
    });
  } catch (error) {
    console.error("Error updating all products environmental impact:", error);
    res
      .status(500)
      .json({
        error: "Failed to update environmental impact for all products",
      });
  }
};

export const getEcoFriendlyProducts = async (req: Request, res: Response) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find({
      "environmentalMetrics.isEcoFriendly": true,
    })
      .sort({ "environmentalMetrics.ecoFriendlyScore": -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Product.countDocuments({
      "environmentalMetrics.isEcoFriendly": true,
    });

    res.json({
      success: true,
      products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("Error fetching eco-friendly products:", error);
    res.status(500).json({ error: "Failed to fetch eco-friendly products" });
  }
};

export const getEnvironmentalImpactByCategory = async (
  req: Request,
  res: Response,
) => {
  try {
    const { category } = req.params;

    const products = await Product.find({
      category: { $regex: category, $options: "i" },
      "environmentalMetrics.co2Emissions": { $exists: true },
    }).select("title brand environmentalMetrics");

    const avgImpact = products.reduce(
      (acc, product) => {
        if (product.environmentalMetrics) {
          acc.co2Emissions += product.environmentalMetrics.co2Emissions;
          acc.waterFootprint += product.environmentalMetrics.waterFootprint;
          acc.energyConsumption +=
            product.environmentalMetrics.energyConsumption;
          acc.ecoFriendlyScore += product.environmentalMetrics.ecoFriendlyScore;
        }
        return acc;
      },
      {
        co2Emissions: 0,
        waterFootprint: 0,
        energyConsumption: 0,
        ecoFriendlyScore: 0,
      },
    );

    const count = products.length;
    if (count > 0) {
      avgImpact.co2Emissions /= count;
      avgImpact.waterFootprint /= count;
      avgImpact.energyConsumption /= count;
      avgImpact.ecoFriendlyScore /= count;
    }

    res.json({
      success: true,
      category,
      averageImpact: {
        co2Emissions: Math.round(avgImpact.co2Emissions * 100) / 100,
        waterFootprint: Math.round(avgImpact.waterFootprint),
        energyConsumption: Math.round(avgImpact.energyConsumption * 10) / 10,
        ecoFriendlyScore: Math.round(avgImpact.ecoFriendlyScore),
        productCount: count,
      },
      products: products.slice(0, 10), // Return top 10 products
    });
  } catch (error) {
    console.error("Error fetching environmental impact by category:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch environmental impact by category" });
  }
};

export const getEnvironmentalComparison = async (
  req: Request,
  res: Response,
) => {
  try {
    const { productIds } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: "Product IDs array is required" });
    }

    const products = await Product.find({
      product_id: { $in: productIds },
    }).select("title brand environmentalMetrics specifications category");

    const comparison = products.map((product) => ({
      product_id: product.product_id,
      title: product.title,
      brand: product.brand,
      category: product.category,
      environmentalMetrics:
        product.environmentalMetrics ||
        calculateEnvironmentalImpact(
          product.specifications,
          product.category,
          product.brand,
        ),
    }));

    res.json({
      success: true,
      comparison,
    });
  } catch (error) {
    console.error("Error creating environmental comparison:", error);
    res
      .status(500)
      .json({ error: "Failed to create environmental comparison" });
  }
};
