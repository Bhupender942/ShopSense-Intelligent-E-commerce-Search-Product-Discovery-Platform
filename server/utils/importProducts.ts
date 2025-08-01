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

    // Process products to add/update popularity scores based on priority categories
    const processedProducts = products.map((product: any) => {
      const category = product.category?.toLowerCase() || "";

      // Define priority categories and their popularity scores
      const priorityCategories = {
        shoes: 85,
        footwear: 85,
        clothing: 80,
        mobile: 90,
        smartphones: 90,
        toys: 75,
        gaming: 75,
        electronics: 70,
        fashion: 80,
        sports: 65,
        home: 60,
        books: 50,
        automotive: 45,
        beauty: 55,
        health: 40,
      };

      // Calculate popularity score based on category priority
      let popularityScore = product.popularity_score || 50;

      // Boost popularity for priority categories
      for (const [priorityCategory, boost] of Object.entries(
        priorityCategories,
      )) {
        if (category.includes(priorityCategory)) {
          popularityScore = Math.min(100, popularityScore + boost);
          break;
        }
      }

      // Additional boosts based on product attributes
      if (product.average_rating && product.average_rating >= 4) {
        popularityScore += 10;
      }

      if (product.discount_percentage && product.discount_percentage > 20) {
        popularityScore += 5;
      }

      return {
        ...product,
        popularity_score: Math.min(100, Math.max(1, popularityScore)),
      };
    });

    // Import products in batches
    const batchSize = 100;
    for (let i = 0; i < processedProducts.length; i += batchSize) {
      const batch = processedProducts.slice(i, i + batchSize);
      await Product.insertMany(batch);
      console.log(
        `Imported ${Math.min(i + batchSize, processedProducts.length)} products`,
      );
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
      const brandStats = await Product.aggregate([
        { $match: { brand } },
        {
          $group: {
            _id: null,
            avgRating: { $avg: "$average_rating" },
            avgPopularity: { $avg: "$popularity_score" },
          },
        },
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
          avgRating: brandStats[0]?.avgRating || 0,
          popularity_score: brandStats[0]?.avgPopularity || 50,
        },
      });
    }

    // Get all categories
    const categories = await Product.distinct("category");
    for (const category of categories) {
      const productCount = await Product.countDocuments({ category });
      const categoryBrands = await Product.distinct("brand", { category });
      const categoryStats = await Product.aggregate([
        { $match: { category } },
        {
          $group: {
            _id: null,
            avgPopularity: { $avg: "$popularity_score" },
            avgRating: { $avg: "$average_rating" },
          },
        },
      ]);

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
          popularity_score: categoryStats[0]?.avgPopularity || 50,
          avgRating: categoryStats[0]?.avgRating || 0,
        },
      });
    }

    // Get all subcategories
    const subcategories = await Product.distinct("subcategory");
    for (const subcategory of subcategories) {
      const productCount = await Product.countDocuments({ subcategory });
      const category = await Product.findOne({ subcategory }, "category");
      const subcategoryStats = await Product.aggregate([
        { $match: { subcategory } },
        {
          $group: {
            _id: null,
            avgPopularity: { $avg: "$popularity_score" },
            avgRating: { $avg: "$average_rating" },
          },
        },
      ]);

      suggestions.push({
        query: subcategory.toLowerCase(),
        type: "subcategory",
        category:
          category?.category
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace("&", "") || "other",
        searchCount: Math.floor(Math.random() * 200) + 20,
        clickCount: Math.floor(Math.random() * 100) + 10,
        quality: 0.6,
        metadata: {
          productCount,
          popularity_score: subcategoryStats[0]?.avgPopularity || 50,
          avgRating: subcategoryStats[0]?.avgRating || 0,
        },
      });
    }

    // Generate product title keywords
    const popularProducts = await Product.find({
      popularity_score: { $gte: 7 },
    })
      .limit(1000)
      .select("title category popularity_score");

    for (const product of popularProducts) {
      const keywords = extractKeywords(product.title);
      for (const keyword of keywords) {
        if (
          keyword.length > 2 &&
          !suggestions.find((s) => s.query === keyword)
        ) {
          suggestions.push({
            query: keyword,
            type: "product",
            category: product.category
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace("&", ""),
            searchCount: Math.floor(product.popularity_score * 10),
            clickCount: Math.floor(product.popularity_score * 5),
            quality: product.popularity_score / 10,
            metadata: {
              popularity_score: product.popularity_score,
            },
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
        console.log(
          `Batch ${i / batchSize + 1} completed with some duplicates`,
        );
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
    .filter(
      (word) =>
        word.length > 2 &&
        !["and", "the", "for", "with", "from"].includes(word),
    );
}

async function getCategoryForBrand(brand: string): Promise<string> {
  const product = await Product.findOne({ brand }, "category");
  return (
    product?.category.toLowerCase().replace(/\s+/g, "-").replace("&", "") ||
    "other"
  );
}
