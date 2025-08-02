export interface EnvironmentalMetrics {
  co2Emissions: number;
  waterFootprint: number;
  energyConsumption: number;
  recyclabilityScore: number;
  ecoFriendlyScore: number;
  isEcoFriendly: boolean;
  environmentalBadge: string;
  sustainabilityFeatures: string[];
}

// Material impact factors
const MATERIAL_IMPACT = {
  bamboo: { co2: 0.5, water: 200, energy: 8, recyclability: 95, ecoScore: 90 },
  hemp: { co2: 0.8, water: 300, energy: 12, recyclability: 90, ecoScore: 88 },
  "organic cotton": {
    co2: 1.2,
    water: 800,
    energy: 20,
    recyclability: 85,
    ecoScore: 85,
  },
  cotton: {
    co2: 2.5,
    water: 2500,
    energy: 50,
    recyclability: 80,
    ecoScore: 70,
  },
  polyester: {
    co2: 3.2,
    water: 100,
    energy: 80,
    recyclability: 60,
    ecoScore: 45,
  },
  silk: { co2: 4.0, water: 2800, energy: 75, recyclability: 60, ecoScore: 68 },
  wool: { co2: 4.1, water: 3500, energy: 85, recyclability: 70, ecoScore: 72 },
  linen: { co2: 2.8, water: 1800, energy: 55, recyclability: 80, ecoScore: 82 },
  jute: { co2: 1.1, water: 500, energy: 18, recyclability: 95, ecoScore: 93 },
  "recycled plastic": {
    co2: 1.5,
    water: 150,
    energy: 25,
    recyclability: 75,
    ecoScore: 78,
  },
  "recycled paper": {
    co2: 0.8,
    water: 400,
    energy: 15,
    recyclability: 90,
    ecoScore: 89,
  },
  "stainless steel": {
    co2: 2.2,
    water: 800,
    energy: 35,
    recyclability: 90,
    ecoScore: 84,
  },
  silicon: {
    co2: 5.0,
    water: 200,
    energy: 120,
    recyclability: 40,
    ecoScore: 35,
  },
  plastic: {
    co2: 3.5,
    water: 100,
    energy: 60,
    recyclability: 50,
    ecoScore: 40,
  },
  metal: { co2: 4.5, water: 1000, energy: 90, recyclability: 85, ecoScore: 75 },
  glass: { co2: 2.0, water: 300, energy: 40, recyclability: 95, ecoScore: 80 },
  ceramic: {
    co2: 3.0,
    water: 500,
    energy: 60,
    recyclability: 70,
    ecoScore: 65,
  },
  wood: { co2: 1.8, water: 400, energy: 25, recyclability: 85, ecoScore: 82 },
  leather: {
    co2: 4.2,
    water: 3000,
    energy: 70,
    recyclability: 30,
    ecoScore: 55,
  },
  synthetic: {
    co2: 3.8,
    water: 150,
    energy: 70,
    recyclability: 55,
    ecoScore: 50,
  },
};

// Category multipliers
const CATEGORY_MULTIPLIERS = {
  Clothing: { co2: 1.0, water: 1.0, energy: 1.0 },
  Electronics: { co2: 1.5, water: 0.3, energy: 2.0 },
  "Home & Kitchen": { co2: 1.2, water: 0.8, energy: 1.3 },
  "Sports & Fitness": { co2: 1.1, water: 1.2, energy: 1.1 },
  "Beauty & Personal Care": { co2: 0.9, water: 1.5, energy: 0.8 },
  Books: { co2: 0.7, water: 0.5, energy: 0.6 },
  "Toys & Games": { co2: 1.3, water: 0.7, energy: 1.4 },
  Accessories: { co2: 0.8, water: 0.6, energy: 0.7 },
};

// Brand sustainability scores
const BRAND_SUSTAINABILITY = {
  patagonia: 95,
  ecobrand: 90,
  greenlife: 88,
  naturalhome: 85,
  eckitchen: 92,
  woolcraft: 72,
  ecopaper: 89,
  batheco: 81,
  jutelife: 93,
  silkeco: 68,
  metaleco: 84,
  ecobottle: 78,
  techcorp: 45,
  fastfashion: 30,
  default: 50,
};

// Country of origin impact
const COUNTRY_IMPACT = {
  usa: { co2: 0.9, water: 0.8, energy: 0.9 },
  germany: { co2: 0.8, water: 0.7, energy: 0.8 },
  india: { co2: 1.1, water: 1.2, energy: 1.1 },
  china: { co2: 1.3, water: 1.4, energy: 1.3 },
  default: { co2: 1.0, water: 1.0, energy: 1.0 },
};

export function calculateEnvironmentalImpact(
  specifications: any,
  category: string,
  brand: string,
): EnvironmentalMetrics {
  // Extract material from specifications
  const material = specifications?.material?.toLowerCase() || "synthetic";
  const weight =
    parseFloat(specifications?.weight?.toString().replace(/[^\d.]/g, "")) || 1;
  const country =
    specifications?.["country of origin"]?.toLowerCase() || "default";

  // Get material impact
  const materialImpact = MATERIAL_IMPACT[material] || MATERIAL_IMPACT.synthetic;

  // Get category multipliers
  const categoryMultiplier =
    CATEGORY_MULTIPLIERS[category] || CATEGORY_MULTIPLIERS["Clothing"];

  // Get brand sustainability score
  const brandScore =
    BRAND_SUSTAINABILITY[brand.toLowerCase()] || BRAND_SUSTAINABILITY.default;

  // Get country impact
  const countryImpact = COUNTRY_IMPACT[country] || COUNTRY_IMPACT.default;

  // Calculate base metrics
  const co2Emissions =
    materialImpact.co2 * weight * categoryMultiplier.co2 * countryImpact.co2;
  const waterFootprint =
    materialImpact.water *
    weight *
    categoryMultiplier.water *
    countryImpact.water;
  const energyConsumption =
    materialImpact.energy *
    weight *
    categoryMultiplier.energy *
    countryImpact.energy;

  // Calculate recyclability score
  const recyclabilityScore = Math.min(
    100,
    materialImpact.recyclability + (brandScore - 50) * 0.2,
  );

  // Calculate eco-friendly score
  const ecoFriendlyScore = Math.min(
    100,
    Math.max(
      0,
      materialImpact.ecoScore * 0.6 +
        brandScore * 0.3 +
        (100 - co2Emissions * 10) * 0.1,
    ),
  );

  // Determine if eco-friendly
  const isEcoFriendly = ecoFriendlyScore >= 70;

  // Generate environmental badge
  let environmentalBadge = "🌍 Moderate Impact";
  if (ecoFriendlyScore >= 90) {
    environmentalBadge = "🌱 Eco Champion";
  } else if (ecoFriendlyScore >= 80) {
    environmentalBadge = "🌿 Green Choice";
  } else if (ecoFriendlyScore >= 70) {
    environmentalBadge = "♻️ Eco Friendly";
  } else if (ecoFriendlyScore >= 50) {
    environmentalBadge = "🌍 Moderate Impact";
  } else {
    environmentalBadge = "⚠️ High Impact";
  }

  // Generate sustainability features
  const sustainabilityFeatures: string[] = [];

  if (materialImpact.ecoScore >= 80) {
    sustainabilityFeatures.push(
      `${material.charAt(0).toUpperCase() + material.slice(1)} (Sustainable)`,
    );
  } else if (materialImpact.ecoScore >= 60) {
    sustainabilityFeatures.push(
      `${material.charAt(0).toUpperCase() + material.slice(1)} (Low Impact)`,
    );
  }

  if (material.includes("organic")) {
    sustainabilityFeatures.push("Organic Materials");
  }

  if (material.includes("recycled")) {
    sustainabilityFeatures.push("Recycled Content");
  }

  if (materialImpact.recyclability >= 90) {
    sustainabilityFeatures.push("Highly Recyclable");
  } else if (materialImpact.recyclability >= 70) {
    sustainabilityFeatures.push("Recyclable");
  }

  if (
    ["bamboo", "hemp", "jute", "cotton", "linen", "wool"].includes(material)
  ) {
    sustainabilityFeatures.push("Natural Fibers");
  }

  if (["bamboo", "hemp", "jute", "cotton", "paper"].includes(material)) {
    sustainabilityFeatures.push("Biodegradable");
  }

  if (material.includes("bamboo")) {
    sustainabilityFeatures.push("Bamboo (Sustainable)");
  }

  if (brandScore >= 80) {
    sustainabilityFeatures.push("Sustainable Brand");
  }

  return {
    co2Emissions: Math.round(co2Emissions * 100) / 100,
    waterFootprint: Math.round(waterFootprint),
    energyConsumption: Math.round(energyConsumption),
    recyclabilityScore: Math.round(recyclabilityScore),
    ecoFriendlyScore: Math.round(ecoFriendlyScore),
    isEcoFriendly,
    environmentalBadge,
    sustainabilityFeatures,
  };
}
