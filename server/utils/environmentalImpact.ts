export interface EnvironmentalMetrics {
  co2Emissions: number; // in kg CO2e
  waterFootprint: number; // in liters
  energyConsumption: number; // in kWh
  recyclabilityScore: number; // 0-100
  ecoFriendlyScore: number; // 0-100
  isEcoFriendly: boolean;
  environmentalBadge: string;
  sustainabilityFeatures: string[];
}

export interface ProductSpecs {
  material?: string;
  weight?: string;
  dimensions?: string;
  countryOfOrigin?: string;
  warranty?: string;
  [key: string]: any;
}

// Environmental impact factors for different materials (kg CO2e per kg of material)
const MATERIAL_IMPACT_FACTORS: { [key: string]: number } = {
  // Natural materials (lower impact)
  cotton: 2.5,
  wool: 13.3,
  silk: 20.3,
  bamboo: 1.8,
  hemp: 1.9,
  linen: 2.1,
  jute: 1.5,
  "organic cotton": 1.8,

  // Synthetic materials (higher impact)
  polyester: 5.5,
  nylon: 6.4,
  acrylic: 5.2,
  spandex: 7.8,
  polyurethane: 4.8,
  pvc: 3.8,
  composite: 4.2,
  plastic: 3.2,

  // Metals
  aluminum: 8.1,
  steel: 1.8,
  copper: 2.5,
  iron: 1.9,

  // Electronics
  silicon: 12.5,
  lithium: 15.2,
  "rare earth": 18.5,

  // Default for unknown materials
  default: 4.0,
};

// Water footprint factors (liters per kg of material)
const WATER_FOOTPRINT_FACTORS: { [key: string]: number } = {
  cotton: 10.0,
  wool: 125.0,
  silk: 9.0,
  bamboo: 1.2,
  hemp: 2.4,
  linen: 6.4,
  "organic cotton": 7.0,
  polyester: 71.0,
  nylon: 138.0,
  acrylic: 87.0,
  aluminum: 1.4,
  steel: 1.4,
  copper: 1.4,
  default: 50.0,
};

// Energy consumption factors (kWh per kg of material)
const ENERGY_FACTORS: { [key: string]: number } = {
  cotton: 55,
  wool: 125,
  silk: 200,
  bamboo: 30,
  hemp: 40,
  linen: 60,
  "organic cotton": 45,
  polyester: 125,
  nylon: 150,
  acrylic: 140,
  aluminum: 170,
  steel: 25,
  copper: 60,
  default: 80,
};

// Recyclability scores (0-100)
const RECYCLABILITY_SCORES: { [key: string]: number } = {
  cotton: 85,
  wool: 70,
  silk: 60,
  bamboo: 95,
  hemp: 90,
  linen: 80,
  "organic cotton": 85,
  polyester: 55,
  nylon: 45,
  acrylic: 40,
  aluminum: 95,
  steel: 90,
  copper: 95,
  default: 50,
};

// Eco-friendly material keywords
const ECO_FRIENDLY_MATERIALS = [
  "organic",
  "bamboo",
  "hemp",
  "linen",
  "recycled",
  "biodegradable",
  "sustainable",
  "eco-friendly",
  "natural",
  "organic cotton",
];

// Manufacturing location impact factors
const LOCATION_IMPACT_FACTORS: { [key: string]: number } = {
  india: 1.0,
  china: 1.2,
  usa: 0.8,
  germany: 0.7,
  japan: 0.8,
  "south korea": 0.9,
  taiwan: 1.0,
  vietnam: 1.1,
  bangladesh: 1.3,
  pakistan: 1.2,
  thailand: 1.0,
  indonesia: 1.1,
  malaysia: 1.0,
  philippines: 1.1,
  default: 1.1,
};

export function calculateEnvironmentalImpact(
  specifications: ProductSpecs,
  category: string,
  brand: string,
): EnvironmentalMetrics {
  const material = extractMaterial(specifications);
  const weight = extractWeight(specifications);
  const country = extractCountry(specifications);

  // Calculate base CO2 emissions
  const materialFactor =
    MATERIAL_IMPACT_FACTORS[material.toLowerCase()] ||
    MATERIAL_IMPACT_FACTORS.default;
  const locationFactor =
    LOCATION_IMPACT_FACTORS[country.toLowerCase()] ||
    LOCATION_IMPACT_FACTORS.default;
  const weightInKg = parseWeight(weight);

  let co2Emissions = materialFactor * weightInKg * locationFactor;

  // Apply category-specific adjustments
  co2Emissions = applyCategoryAdjustments(co2Emissions, category);

  // Calculate water footprint
  const waterFactor =
    WATER_FOOTPRINT_FACTORS[material.toLowerCase()] ||
    WATER_FOOTPRINT_FACTORS.default;
  const waterFootprint = waterFactor * weightInKg;

  // Calculate energy consumption
  const energyFactor =
    ENERGY_FACTORS[material.toLowerCase()] || ENERGY_FACTORS.default;
  const energyConsumption = energyFactor * weightInKg;

  // Calculate recyclability score
  const recyclabilityScore =
    RECYCLABILITY_SCORES[material.toLowerCase()] ||
    RECYCLABILITY_SCORES.default;

  // Calculate eco-friendly score
  const ecoFriendlyScore = calculateEcoFriendlyScore(
    material,
    category,
    brand,
    recyclabilityScore,
    co2Emissions,
  );

  // Determine if product is eco-friendly
  const isEcoFriendly = ecoFriendlyScore >= 70;

  // Generate environmental badge
  const environmentalBadge = generateEnvironmentalBadge(ecoFriendlyScore);

  // Generate sustainability features
  const sustainabilityFeatures = generateSustainabilityFeatures(
    material,
    category,
    brand,
    recyclabilityScore,
  );

  return {
    co2Emissions: Math.round(co2Emissions * 100) / 100,
    waterFootprint: Math.round(waterFootprint),
    energyConsumption: Math.round(energyConsumption * 10) / 10,
    recyclabilityScore: Math.round(recyclabilityScore),
    ecoFriendlyScore: Math.round(ecoFriendlyScore),
    isEcoFriendly,
    environmentalBadge,
    sustainabilityFeatures,
  };
}

function extractMaterial(specifications: ProductSpecs): string {
  const materialKeys = [
    "material",
    "fabric",
    "composition",
    "made of",
    "construction",
  ];

  for (const key of materialKeys) {
    if (specifications[key]) {
      return specifications[key].toString();
    }
  }

  // Try to find material in other fields
  for (const [key, value] of Object.entries(specifications)) {
    if (typeof value === "string" && value.toLowerCase().includes("cotton"))
      return "cotton";
    if (typeof value === "string" && value.toLowerCase().includes("polyester"))
      return "polyester";
    if (typeof value === "string" && value.toLowerCase().includes("wool"))
      return "wool";
    if (typeof value === "string" && value.toLowerCase().includes("silk"))
      return "silk";
    if (typeof value === "string" && value.toLowerCase().includes("bamboo"))
      return "bamboo";
    if (typeof value === "string" && value.toLowerCase().includes("hemp"))
      return "hemp";
    if (typeof value === "string" && value.toLowerCase().includes("linen"))
      return "linen";
    if (typeof value === "string" && value.toLowerCase().includes("aluminum"))
      return "aluminum";
    if (typeof value === "string" && value.toLowerCase().includes("steel"))
      return "steel";
  }

  return "default";
}

function extractWeight(specifications: ProductSpecs): string {
  const weightKeys = ["weight", "mass", "kg", "grams", "g"];

  for (const key of weightKeys) {
    if (specifications[key]) {
      return specifications[key].toString();
    }
  }

  // Try to find weight in other fields
  for (const [key, value] of Object.entries(specifications)) {
    if (
      typeof value === "string" &&
      (value.includes("kg") || value.includes("g") || value.includes("gram"))
    ) {
      return value;
    }
  }

  return "1 kg"; // Default weight
}

function extractCountry(specifications: ProductSpecs): string {
  const countryKeys = [
    "country of origin",
    "made in",
    "origin",
    "manufacturing country",
  ];

  for (const key of countryKeys) {
    if (specifications[key]) {
      return specifications[key].toString();
    }
  }

  return "default";
}

function parseWeight(weightStr: string): number {
  if (!weightStr) return 1;

  const weight = weightStr.toLowerCase();
  if (weight.includes("kg")) {
    return parseFloat(weight.replace(/[^\d.]/g, "")) || 1;
  } else if (weight.includes("g") || weight.includes("gram")) {
    return (parseFloat(weight.replace(/[^\d.]/g, "")) || 1000) / 1000;
  }

  return 1; // Default to 1kg
}

function applyCategoryAdjustments(
  co2Emissions: number,
  category: string,
): number {
  const categoryMultipliers: { [key: string]: number } = {
    electronics: 1.5,
    clothing: 1.0,
    footwear: 1.2,
    accessories: 0.8,
    "home & kitchen": 1.1,
    "sports & fitness": 1.3,
    "beauty & personal care": 1.4,
    automotive: 2.0,
    books: 0.5,
    "toys & games": 0.9,
  };

  const multiplier = categoryMultipliers[category.toLowerCase()] || 1.0;
  return co2Emissions * multiplier;
}

function calculateEcoFriendlyScore(
  material: string,
  category: string,
  brand: string,
  recyclabilityScore: number,
  co2Emissions: number,
): number {
  let score = 50; // Base score

  // Material impact (40% weight)
  const materialScore = calculateMaterialScore(material);
  score += materialScore * 0.4;

  // Recyclability impact (25% weight)
  score += (recyclabilityScore - 50) * 0.25;

  // CO2 emissions impact (20% weight)
  const co2Score = Math.max(0, 100 - co2Emissions * 10);
  score += co2Score * 0.2;

  // Brand reputation (10% weight)
  const brandScore = calculateBrandScore(brand);
  score += brandScore * 0.1;

  // Category impact (5% weight)
  const categoryScore = calculateCategoryScore(category);
  score += categoryScore * 0.05;

  return Math.max(0, Math.min(100, score));
}

function calculateMaterialScore(material: string): number {
  const materialLower = material.toLowerCase();

  if (ECO_FRIENDLY_MATERIALS.some((eco) => materialLower.includes(eco))) {
    return 100;
  }

  const ecoMaterials = ["bamboo", "hemp", "linen", "organic cotton"];
  if (ecoMaterials.some((eco) => materialLower.includes(eco))) {
    return 90;
  }

  const naturalMaterials = ["cotton", "wool", "silk"];
  if (naturalMaterials.some((nat) => materialLower.includes(nat))) {
    return 70;
  }

  const syntheticMaterials = ["polyester", "nylon", "acrylic", "plastic"];
  if (syntheticMaterials.some((syn) => materialLower.includes(syn))) {
    return 30;
  }

  return 50;
}

function calculateBrandScore(brand: string): number {
  const ecoFriendlyBrands = [
    "patagonia",
    "tentree",
    "reformation",
    "everlane",
    "allbirds",
    "veja",
    "rothys",
    "stella mccartney",
    "eileen fisher",
  ];

  const brandLower = brand.toLowerCase();
  if (ecoFriendlyBrands.some((eco) => brandLower.includes(eco))) {
    return 100;
  }

  return 50; // Default brand score
}

function calculateCategoryScore(category: string): number {
  const ecoFriendlyCategories = ["books", "home & kitchen"];
  const highImpactCategories = ["electronics", "automotive"];

  const categoryLower = category.toLowerCase();

  if (ecoFriendlyCategories.some((eco) => categoryLower.includes(eco))) {
    return 80;
  }

  if (highImpactCategories.some((high) => categoryLower.includes(high))) {
    return 30;
  }

  return 60;
}

function generateEnvironmentalBadge(ecoFriendlyScore: number): string {
  if (ecoFriendlyScore >= 90) return "🌱 Eco Champion";
  if (ecoFriendlyScore >= 80) return "🌿 Green Choice";
  if (ecoFriendlyScore >= 70) return "♻️ Eco Friendly";
  if (ecoFriendlyScore >= 50) return "🌍 Moderate Impact";
  return "⚠️ High Impact";
}

function generateSustainabilityFeatures(
  material: string,
  category: string,
  brand: string,
  recyclabilityScore: number,
): string[] {
  const features: string[] = [];

  const materialLower = material.toLowerCase();

  if (materialLower.includes("organic")) features.push("Organic Materials");
  if (materialLower.includes("recycled")) features.push("Recycled Content");
  if (materialLower.includes("bamboo")) features.push("Bamboo (Sustainable)");
  if (materialLower.includes("hemp")) features.push("Hemp (Low Impact)");
  if (recyclabilityScore >= 80) features.push("Highly Recyclable");
  if (recyclabilityScore >= 60) features.push("Recyclable");

  return features;
}
