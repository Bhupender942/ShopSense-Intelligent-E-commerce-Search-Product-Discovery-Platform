import { connectToDatabase } from "../db/connection";
import Product from "../models/Products";
import { calculateEnvironmentalImpact } from "./environmentalImpact";

export async function updateAllProductsEnvironmentalData() {
  try {
    console.log("Connecting to database...");
    await connectToDatabase();

    console.log("Fetching all products...");
    const products = await Product.find({});
    console.log(`Found ${products.length} products to update`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
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

        if (updatedCount % 100 === 0) {
          console.log(`Updated ${updatedCount} products...`);
        }
      } catch (error) {
        console.error(`Error updating product ${product.product_id}:`, error);
        errorCount++;
      }
    }

    console.log(`\nUpdate completed!`);
    console.log(`Successfully updated: ${updatedCount} products`);
    console.log(`Errors: ${errorCount} products`);

    // Get some statistics
    const ecoFriendlyCount = await Product.countDocuments({
      "environmentalMetrics.isEcoFriendly": true,
    });

    const avgEcoScore = await Product.aggregate([
      {
        $match: { "environmentalMetrics.ecoFriendlyScore": { $exists: true } },
      },
      {
        $group: {
          _id: null,
          avgScore: { $avg: "$environmentalMetrics.ecoFriendlyScore" },
        },
      },
    ]);

    console.log(`\nEnvironmental Statistics:`);
    console.log(`Eco-friendly products: ${ecoFriendlyCount}`);
    console.log(
      `Average eco-friendly score: ${avgEcoScore[0]?.avgScore?.toFixed(2) || "N/A"}`,
    );
  } catch (error) {
    console.error("Error updating environmental data:", error);
  }
}

// Run the update if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updateAllProductsEnvironmentalData()
    .then(() => {
      console.log("Environmental data update completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to update environmental data:", error);
      process.exit(1);
    });
}
