import fs from "fs";
import path from "path";
import Product from "../models/Products";
import SearchSuggestion from "../models/SearchSuggestion";

export async function importProductData(): Promise<void> {
  try {
    console.log("Starting product data import...");
    
    // Check if products already exist
    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
      console.log(`Products already imported (${existingCount} products)`);
      return;
    }

    // Read the JSON file
    const filePath = path.join(process.cwd(), "flipkart_products.json");
    const rawData = fs.readFileSync(filePath, "utf8");
    const products = JSON.parse(rawData);

    console.log(`Importing ${products.length} products...`);

    // Import products in batches
    const batchSize = 100;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      await Product.insertMany(batch);
      console.log(`Imported ${Math.min(i + batchSize, products.length)} products`);
    }

    console.log("Product import completed!");
    
    // Generate autosuggest data
    await generateAutosuggestData();
    
  } catch (error) {
    console.error("Error importing product data:", error);
  }
}

async function generateAutosuggestData(): Promise<void> {
  try {
    console.log("Generating autosuggest data...");

    const suggestions = [];

    // Get all unique brands
    const brands = await Product.distinct("brand");
    for (const brand of brands) {
      const productCount = await Product.countDocuments({ brand });
      const avgRating = await Product.aggregate([
        { $match: { brand } },
        { $group: { _id: null, avgRating: { $avg: "$average_rating" } } }
      ]);

      suggestions.push({
        query: brand.toLowerCase(),
        type: "brand",
        category: await getCategoryForBrand(brand),
        searchCount: Math.floor(Math.random() * 100) + 10,
        clickCount: Math.floor(Math.random() * 50) + 5,
        quality: 0.7,
        metadata: {
          productCount,
          avgRating: avgRating[0]?.avgRating || 0,
        }
      });
    }

    // Get all categories
    const categories = await Product.distinct("category");
    for (const category of categories) {
      const productCount = await Product.countDocuments({ category });
      const categoryBrands = await Product.distinct("brand", { category });

      suggestions.push({
        query: category.toLowerCase(),
        type: "category",
        category: category.toLowerCase().replace(/\s+/g, "-").replace("&", ""),
        searchCount: Math.floor(Math.random() * 500) + 100,
        clickCount: Math.floor(Math.random() * 250) + 50,
        quality: 0.9,
        metadata: {
          productCount,
          brands: categoryBrands.slice(0, 10),
        }
      });
    }

    // Get all subcategories
    const subcategories = await Product.distinct("subcategory");
    for (const subcategory of subcategories) {
      const productCount = await Product.countDocuments({ subcategory });
      const category = await Product.findOne({ subcategory }, "category");

      suggestions.push({
        query: subcategory.toLowerCase(),
        type: "subcategory",
        category: category?.category.toLowerCase().replace(/\s+/g, "-").replace("&", "") || "other",
        searchCount: Math.floor(Math.random() * 200) + 20,
        clickCount: Math.floor(Math.random() * 100) + 10,
        quality: 0.6,
        metadata: {
          productCount,
        }
      });
    }

    // Generate product title keywords
    const popularProducts = await Product.find({ popularity_score: { $gte: 7 } })
      .limit(1000)
      .select("title category popularity_score");

    for (const product of popularProducts) {
      const keywords = extractKeywords(product.title);
      for (const keyword of keywords) {
        if (keyword.length > 2 && !suggestions.find(s => s.query === keyword)) {
          suggestions.push({
            query: keyword,
            type: "product",
            category: product.category.toLowerCase().replace(/\s+/g, "-").replace("&", ""),
            searchCount: Math.floor(product.popularity_score * 10),
            clickCount: Math.floor(product.popularity_score * 5),
            quality: product.popularity_score / 10,
            metadata: {}
          });
        }
      }
    }

    // Insert suggestions in batches
    const batchSize = 100;
    for (let i = 0; i < suggestions.length; i += batchSize) {
      const batch = suggestions.slice(i, i + batchSize);
      try {
        await SearchSuggestion.insertMany(batch, { ordered: false });
      } catch (error) {
        // Ignore duplicate key errors
        console.log(`Batch ${i / batchSize + 1} completed with some duplicates`);
      }
    }

    console.log(`Generated ${suggestions.length} autosuggest entries`);
    
  } catch (error) {
    console.error("Error generating autosuggest data:", error);
  }
}

function extractKeywords(title: string): string[] {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(word => word.length > 2 && !["and", "the", "for", "with", "from"].includes(word));
}

async function getCategoryForBrand(brand: string): Promise<string> {
  const product = await Product.findOne({ brand }, "category");
  return product?.category.toLowerCase().replace(/\s+/g, "-").replace("&", "") || "other";
}