import { calculateEnvironmentalImpact } from "./environmentalImpact";

// Test cases for environmental impact calculation
const testCases = [
  {
    name: "Bamboo Product",
    specifications: {
      material: "Bamboo",
      weight: "2 kg",
      "country of origin": "India",
    },
    category: "Clothing",
    brand: "EcoBrand",
  },
  {
    name: "Polyester Product",
    specifications: {
      material: "Polyester",
      weight: "1.5 kg",
      "country of origin": "China",
    },
    category: "Clothing",
    brand: "FastFashion",
  },
  {
    name: "Organic Cotton Product",
    specifications: {
      material: "Organic Cotton",
      weight: "0.8 kg",
      "country of origin": "USA",
    },
    category: "Clothing",
    brand: "Patagonia",
  },
  {
    name: "Electronics Product",
    specifications: {
      material: "Silicon",
      weight: "0.5 kg",
      "country of origin": "Germany",
    },
    category: "Electronics",
    brand: "TechCorp",
  },
];

console.log("🧪 Testing Environmental Impact Calculations\n");

testCases.forEach((testCase, index) => {
  console.log(`\n${index + 1}. ${testCase.name}`);
  console.log("─".repeat(50));

  const result = calculateEnvironmentalImpact(
    testCase.specifications,
    testCase.category,
    testCase.brand,
  );

  console.log(`Material: ${testCase.specifications.material}`);
  console.log(`Weight: ${testCase.specifications.weight}`);
  console.log(`Country: ${testCase.specifications["country of origin"]}`);
  console.log(`Category: ${testCase.category}`);
  console.log(`Brand: ${testCase.brand}`);
  console.log("");
  console.log(`📊 Environmental Metrics:`);
  console.log(`   CO₂ Emissions: ${result.co2Emissions} kg CO₂e`);
  console.log(
    `   Water Footprint: ${result.waterFootprint.toLocaleString()} L`,
  );
  console.log(`   Energy Consumption: ${result.energyConsumption} kWh`);
  console.log(`   Recyclability Score: ${result.recyclabilityScore}%`);
  console.log(`   Eco-Friendly Score: ${result.ecoFriendlyScore}/100`);
  console.log(
    `   Is Eco-Friendly: ${result.isEcoFriendly ? "✅ Yes" : "❌ No"}`,
  );
  console.log(`   Environmental Badge: ${result.environmentalBadge}`);

  if (result.sustainabilityFeatures.length > 0) {
    console.log(
      `   Sustainability Features: ${result.sustainabilityFeatures.join(", ")}`,
    );
  }
});

console.log("\n✅ Environmental impact calculation test completed!");
