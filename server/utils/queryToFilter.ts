import mongoose from "mongoose";
import Product from "../models/Products";

interface EntityMap {
  [key: string]: {
    type: string;
    attributes: {
      [key: string]: string | string[];
    };
  };
}

interface QueryFilterResult {
  filters: {
    [key: string]: any;
  };
  confidence: number;
  entities: string[];
  inferredIntent?: string;
}

// Knowledge graph - taxonomy mapping
const productKnowledgeGraph: EntityMap = {
  // Main Categories
  electronics: {
    type: "category",
    attributes: {
      subcategories: [
        "smartphones",
        "laptops",
        "televisions",
        "cameras",
        "audio",
        "wearables",
        "computer accessories",
      ],
      brands: [
        "samsung",
        "apple",
        "xiaomi",
        "oneplus",
        "sony",
        "lg",
        "hp",
        "dell",
      ],
      relatedTerms: ["gadgets", "tech", "devices", "electronic"],
    },
  },
  clothing: {
    type: "category",
    attributes: {
      subcategories: [
        "t-shirts",
        "shirts",
        "trousers",
        "jeans",
        "kurtas",
        "sarees",
        "dresses",
        "tops",
        "jackets",
      ],
      gender: ["men", "women", "unisex"],
      relatedTerms: ["wear", "apparel", "clothes", "garments", "outfit"],
    },
  },
  footwear: {
    type: "category",
    attributes: {
      subcategories: [
        "casual shoes",
        "sports shoes",
        "formal shoes",
        "sandals",
        "flip flops",
        "boots",
      ],
      gender: ["men", "women", "unisex"],
      relatedTerms: ["shoes", "footwears", "slippers", "shoe", "sandal"],
    },
  },
  appliances: {
    type: "category",
    attributes: {
      subcategories: [
        "refrigerators",
        "washing machines",
        "air conditioners",
        "microwaves",
        "water purifiers",
      ],
      relatedTerms: ["home appliance", "appliance", "electronic", "household"],
    },
  },
  "beauty & personal care": {
    type: "category",
    attributes: {
      subcategories: [
        "skincare",
        "haircare",
        "makeup",
        "fragrances",
        "grooming",
      ],
      gender: ["men", "women", "unisex"],
      relatedTerms: ["beauty", "personal care", "cosmetics", "grooming"],
    },
  },
  "home & furniture": {
    type: "category",
    attributes: {
      subcategories: [
        "beds",
        "sofas",
        "dining tables",
        "wardrobes",
        "kitchen & dining",
        "home decor",
      ],
      relatedTerms: ["furniture", "home", "decor", "interior", "household"],
    },
  },
  "sports & fitness": {
    type: "category",
    attributes: {
      subcategories: [
        "exercise equipment",
        "sports wear",
        "outdoor sports",
        "fitness gadgets",
        "yoga",
      ],
      gender: ["men", "women", "unisex"],
      relatedTerms: ["gym", "fitness", "workout", "sports", "athletic"],
    },
  },
  books: {
    type: "category",
    attributes: {
      subcategories: [
        "fiction",
        "non-fiction",
        "educational",
        "comics",
        "biography",
      ],
      relatedTerms: ["book", "reading", "novel", "literature", "text"],
    },
  },
  "toys & baby": {
    type: "category",
    attributes: {
      subcategories: [
        "toys",
        "baby care",
        "school supplies",
        "remote control toys",
        "outdoor play",
      ],
      gender: ["boys", "girls", "unisex"],
      relatedTerms: ["kids", "child", "toy", "baby products", "infant"],
    },
  },

  // Electronics Subcategories
  smartphones: {
    type: "subcategory",
    attributes: {
      parentCategory: "electronics",
      brands: [
        "samsung",
        "apple",
        "xiaomi",
        "oneplus",
        "vivo",
        "oppo",
        "realme",
        "motorola",
        "nokia",
        "google",
      ],
      aliases: ["mobile", "phone", "cell phone", "mobiles", "phones"],
    },
  },
  laptops: {
    type: "subcategory",
    attributes: {
      parentCategory: "electronics",
      brands: [
        "hp",
        "dell",
        "lenovo",
        "asus",
        "acer",
        "apple",
        "msi",
        "microsoft",
        "lg",
        "xiaomi",
      ],
      aliases: ["laptop", "notebook", "portable computer", "laptops"],
    },
  },
  televisions: {
    type: "subcategory",
    attributes: {
      parentCategory: "electronics",
      brands: [
        "samsung",
        "lg",
        "sony",
        "mi",
        "oneplus",
        "tcl",
        "panasonic",
        "philips",
        "vu",
        "toshiba",
      ],
      aliases: ["tv", "television", "smart tv", "tvs", "led tv", "lcd tv"],
    },
  },
  cameras: {
    type: "subcategory",
    attributes: {
      parentCategory: "electronics",
      brands: [
        "canon",
        "nikon",
        "sony",
        "fujifilm",
        "gopro",
        "panasonic",
        "olympus",
        "dji",
      ],
      aliases: ["camera", "digital camera", "dslr", "mirrorless", "cameras"],
    },
  },

  // Footwear Subcategories
  shoes: {
    type: "subcategory",
    attributes: {
      parentCategory: "footwear",
      gender: ["men", "women", "unisex"],
      aliases: ["shoe", "footwear"],
    },
  },
  "casual shoes": {
    type: "subcategory",
    attributes: {
      parentCategory: "footwear",
      brands: [
        "nike",
        "adidas",
        "puma",
        "reebok",
        "skechers",
        "converse",
        "vans",
        "bata",
      ],
      idealFor: ["men", "women", "unisex"],
      aliases: ["casual shoe", "everyday shoes", "sneakers"],
    },
  },
  "sports shoes": {
    type: "subcategory",
    attributes: {
      parentCategory: "footwear",
      brands: [
        "nike",
        "adidas",
        "puma",
        "reebok",
        "asics",
        "new balance",
        "under armour",
        "fila",
      ],
      idealFor: ["men", "women", "unisex"],
      aliases: [
        "running shoes",
        "athletic shoes",
        "sports footwear",
        "training shoes",
        "sneakers",
      ],
    },
  },
  "formal shoes": {
    type: "subcategory",
    attributes: {
      parentCategory: "footwear",
      brands: [
        "clarks",
        "bata",
        "red tape",
        "hush puppies",
        "lee cooper",
        "arrow",
        "louis philippe",
      ],
      idealFor: ["men", "women"],
      aliases: [
        "formal footwear",
        "dress shoes",
        "formal wear shoes",
        "leather shoes",
        "office shoes",
      ],
    },
  },
  sandals: {
    type: "subcategory",
    attributes: {
      parentCategory: "footwear",
      brands: [
        "bata",
        "paragon",
        "relaxo",
        "sparx",
        "liberty",
        "nike",
        "adidas",
        "crocs",
      ],
      idealFor: ["men", "women", "unisex"],
      aliases: ["flip flops", "sandal", "open shoes", "slippers", "flats"],
    },
  },
  "flip flops": {
    type: "subcategory",
    attributes: {
      parentCategory: "footwear",
      brands: [
        "bata",
        "paragon",
        "relaxo",
        "sparx",
        "liberty",
        "nike",
        "adidas",
        "crocs",
        "havaianas",
      ],
      idealFor: ["men", "women", "unisex"],
      aliases: ["slippers", "hawaii chappal", "beach slippers", "flip flop"],
    },
  },
  boots: {
    type: "subcategory",
    attributes: {
      parentCategory: "footwear",
      brands: [
        "woodland",
        "red tape",
        "lee cooper",
        "bata",
        "hush puppies",
        "timberland",
        "cat",
        "clarks",
      ],
      idealFor: ["men", "women", "unisex"],
      aliases: [
        "ankle boots",
        "leather boots",
        "hiking boots",
        "winter boots",
        "boot",
      ],
    },
  },

  // Clothing Subcategories
  "t-shirts": {
    type: "subcategory",
    attributes: {
      parentCategory: "clothing",
      brands: [
        "levi's",
        "allen solly",
        "puma",
        "nike",
        "adidas",
        "h&m",
        "uspa",
        "jack & jones",
      ],
      idealFor: ["men", "women", "unisex"],
      aliases: ["tee", "t shirt", "tshirt", "t-shirt"],
    },
  },
  shirts: {
    type: "subcategory",
    attributes: {
      parentCategory: "clothing",
      brands: [
        "allen solly",
        "peter england",
        "louis philippe",
        "van heusen",
        "arrow",
        "park avenue",
        "raymond",
      ],
      idealFor: ["men", "women"],
      aliases: ["shirt", "formal shirt", "casual shirt", "dress shirt"],
    },
  },
  jeans: {
    type: "subcategory",
    attributes: {
      parentCategory: "clothing",
      brands: [
        "levi's",
        "wrangler",
        "lee",
        "pepe jeans",
        "diesel",
        "spykar",
        "flying machine",
      ],
      idealFor: ["men", "women", "unisex"],
      aliases: ["denim", "denim jeans", "jean", "pants"],
    },
  },

  // Demographics
  men: {
    type: "demographic",
    attributes: {
      gender: "male",
      aliases: ["man", "gents", "boys", "male", "mens", "men's", "for men"],
      categories: [
        "clothing",
        "footwear",
        "sports & fitness",
        "beauty & personal care",
      ],
    },
  },
  women: {
    type: "demographic",
    attributes: {
      gender: "female",
      aliases: [
        "woman",
        "ladies",
        "girls",
        "female",
        "womens",
        "women's",
        "for women",
      ],
      categories: [
        "clothing",
        "footwear",
        "sports & fitness",
        "beauty & personal care",
      ],
    },
  },
  kids: {
    type: "demographic",
    attributes: {
      ageGroup: "children",
      aliases: [
        "children",
        "child",
        "boy",
        "girl",
        "kids'",
        "for kids",
        "junior",
      ],
      categories: ["clothing", "footwear", "toys & baby", "books"],
    },
  },
  boys: {
    type: "demographic",
    attributes: {
      gender: "male",
      ageGroup: "children",
      aliases: ["boy", "young boys", "little boys", "boys'", "for boys"],
      categories: ["clothing", "footwear", "toys & baby"],
    },
  },
  girls: {
    type: "demographic",
    attributes: {
      gender: "female",
      ageGroup: "children",
      aliases: ["girl", "young girls", "little girls", "girls'", "for girls"],
      categories: ["clothing", "footwear", "toys & baby"],
    },
  },
  unisex: {
    type: "demographic",
    attributes: {
      gender: "unisex",
      aliases: ["for all", "gender neutral", "both", "any gender"],
      categories: ["clothing", "footwear", "sports & fitness"],
    },
  },

  // Brands as entities
  samsung: {
    type: "brand",
    attributes: {
      categories: ["electronics", "appliances"],
      subcategories: [
        "smartphones",
        "televisions",
        "refrigerators",
        "washing machines",
      ],
    },
  },
  apple: {
    type: "brand",
    attributes: {
      categories: ["electronics"],
      subcategories: ["smartphones", "laptops", "wearables"],
      aliases: ["iphone", "macbook", "mac", "ipad", "airpods"],
    },
  },
  nike: {
    type: "brand",
    attributes: {
      categories: ["footwear", "clothing", "sports & fitness"],
      subcategories: [
        "sports shoes",
        "casual shoes",
        "t-shirts",
        "sports wear",
      ],
    },
  },
  adidas: {
    type: "brand",
    attributes: {
      categories: ["footwear", "clothing", "sports & fitness"],
      subcategories: [
        "sports shoes",
        "casual shoes",
        "t-shirts",
        "sports wear",
      ],
    },
  },

  // Festivals/Events
  rakhi: {
    type: "festival",
    attributes: {
      category: "rakhi-merchandise",
      relatedItems: ["rakhi", "gifts", "sweets"],
      season: "august",
    },
  },
  bhai: {
    type: "relationship",
    attributes: {
      relation: "brother",
      aliases: ["brother", "brothers"],
      relatedEvents: ["rakhi"],
    },
  },
  diwali: {
    type: "festival",
    attributes: {
      category: "diwali-merchandise",
      relatedItems: ["lights", "candles", "gifts", "decorations", "sweets"],
      season: "october-november",
      aliases: ["deepavali", "festival of lights"],
    },
  },
};

// Helper function to tokenize and normalize query
function tokenizeQuery(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1);
}

// Helper function to find entities in tokens
function extractEntities(tokens: string[]): Map<string, string> {
  const entities = new Map<string, string>();
  const multiWordEntities = new Set<string>();

  // Check for multi-word entities first (like "casual shoes", "t-shirts")
  const fullQuery = tokens.join(" ");
  Object.keys(productKnowledgeGraph).forEach((entity) => {
    if (entity.includes(" ")) {
      const entityLower = entity.toLowerCase();
      if (fullQuery.includes(entityLower)) {
        entities.set(entity, productKnowledgeGraph[entity].type);
        multiWordEntities.add(entity);
      }
    }
  });

  // Process individual tokens
  tokens.forEach((token) => {
    // Skip tokens that are already part of a multi-word entity
    if (
      Array.from(multiWordEntities).some((entity) => entity.includes(token))
    ) {
      return;
    }

    // Direct match
    if (productKnowledgeGraph[token]) {
      entities.set(token, productKnowledgeGraph[token].type);
    }

    // Check for aliases and related terms
    Object.keys(productKnowledgeGraph).forEach((entity) => {
      // Skip if this token is already matched to this entity
      if (
        entities.has(entity) &&
        entities.get(entity) === productKnowledgeGraph[entity].type
      ) {
        return;
      }

      const entityData = productKnowledgeGraph[entity];

      // Check all attributes that might contain aliases or related terms
      Object.keys(entityData.attributes).forEach((attrKey) => {
        const attr = entityData.attributes[attrKey];

        // Check arrays (aliases, related terms, etc.)
        if (Array.isArray(attr)) {
          if (attr.includes(token)) {
            entities.set(entity, entityData.type);
          } else {
            // Check for partial matches in longer terms (e.g., "phone" in "smartphone")
            const partialMatches = attr.filter(
              (term) => term.includes(token) || token.includes(term),
            );
            if (partialMatches.length > 0) {
              entities.set(entity, entityData.type);
            }
          }
        }

        // Check if the token is a substring of the entity name for categories and subcategories
        if (
          (entityData.type === "category" ||
            entityData.type === "subcategory") &&
          (entity.includes(token) || token.includes(entity))
        ) {
          entities.set(entity, entityData.type);
        }
      });
    });
  });

  return entities;
}

// Helper function to resolve relationships between entities
function resolveRelationships(
  entities: Map<string, string>,
  tokens: string[],
): QueryFilterResult {
  const result: QueryFilterResult = {
    filters: {},
    confidence: 0.5,
    entities: Array.from(entities.keys()),
  };

  // Initialize filters
  let categoryFound = false;
  let subcategoryFound = false;
  let demographicFound = false;
  let brandFound = false;
  let hasQualifier = false;

  // Process each entity
  entities.forEach((type, entity) => {
    const entityData = productKnowledgeGraph[entity];

    switch (type) {
      case "category":
        result.filters.category = entity;
        categoryFound = true;
        result.confidence += 0.2;
        break;

      case "subcategory":
        result.filters.subcategory = entity;
        subcategoryFound = true;
        result.confidence += 0.15;

        // Infer parent category if not explicitly mentioned
        if (!categoryFound && entityData.attributes.parentCategory) {
          result.filters.category = entityData.attributes.parentCategory;
          categoryFound = true;
          result.confidence += 0.1;
        }
        break;

      case "demographic":
        // Handle gender filter
        if (entityData.attributes.gender) {
          result.filters.gender = entityData.attributes.gender;
          demographicFound = true;
          result.confidence += 0.15;
        }

        // Handle age group filter (like "kids")
        if (entityData.attributes.ageGroup) {
          result.filters.ageGroup = entityData.attributes.ageGroup;
          result.confidence += 0.1;
        }
        break;

      case "brand":
        result.filters.brand = entity;
        brandFound = true;
        result.confidence += 0.2;

        // Infer categories from brand if not explicitly mentioned
        if (
          !categoryFound &&
          entityData.attributes.categories &&
          Array.isArray(entityData.attributes.categories) &&
          entityData.attributes.categories.length > 0
        ) {
          // Prioritize first category associated with brand
          result.filters.category = entityData.attributes.categories[0];
          categoryFound = true;
          result.confidence += 0.05;
        }

        // Infer subcategories from brand if not explicitly mentioned
        if (
          !subcategoryFound &&
          entityData.attributes.subcategories &&
          Array.isArray(entityData.attributes.subcategories) &&
          entityData.attributes.subcategories.length > 0
        ) {
          // Prioritize first subcategory associated with brand
          result.filters.subcategory = entityData.attributes.subcategories[0];
          subcategoryFound = true;
          result.confidence += 0.05;
        }
        break;

      case "festival":
        result.filters.category = entityData.attributes.category || entity;
        categoryFound = true;
        result.confidence += 0.2;

        // Add seasonal attribute if available
        if (entityData.attributes.season) {
          result.filters.season = entityData.attributes.season;
          result.confidence += 0.05;
        }
        break;

      case "relationship":
        hasQualifier = true;
        // Process relationship entities
        entities.forEach((otherType, otherEntity) => {
          if (
            otherType === "festival" &&
            entityData.attributes.relatedEvents &&
            Array.isArray(entityData.attributes.relatedEvents) &&
            entityData.attributes.relatedEvents.includes(otherEntity)
          ) {
            // Special case handling (like "rakhi for bhai")
            const festivalData = productKnowledgeGraph[otherEntity];
            result.filters.category = festivalData.attributes.category;
            result.confidence += 0.15;
          }
        });
        break;
    }
  });

  // Process phrase patterns
  processQueryPatterns(tokens, entities, result);

  // Enhance with brand-demographic relationships
  if (brandFound && demographicFound) {
    result.confidence += 0.1;
  }

  // Enhance with brand-category relationships
  if (brandFound && categoryFound) {
    result.confidence += 0.1;
  }

  // Infer intent from query structure
  if (categoryFound && demographicFound) {
    result.inferredIntent = `${result.filters.category}_browse_demographic`;
    result.confidence = Math.min(0.9, result.confidence + 0.1);
  } else if (categoryFound && brandFound) {
    result.inferredIntent = `${result.filters.category}_browse_brand`;
    result.confidence = Math.min(0.9, result.confidence + 0.1);
  } else if (subcategoryFound) {
    result.inferredIntent = `${result.filters.subcategory}_browse`;
    result.confidence = Math.min(0.9, result.confidence + 0.05);
  } else if (categoryFound) {
    result.inferredIntent = `${result.filters.category}_browse`;
    result.confidence = Math.min(0.9, result.confidence);
  } else if (brandFound) {
    result.inferredIntent = `brand_browse`;
    result.confidence = Math.min(0.9, result.confidence);
  }

  return result;
}

// Helper function to process common query patterns
function processQueryPatterns(
  tokens: string[],
  entities: Map<string, string>,
  result: QueryFilterResult,
): void {
  // "X for Y" pattern (e.g., "shoes for men", "gifts for kids")
  const forIndex = tokens.indexOf("for");
  if (forIndex !== -1 && forIndex < tokens.length - 1) {
    const beforeFor = tokens.slice(0, forIndex);
    const afterFor = tokens.slice(forIndex + 1);

    // Process demographic targets after "for"
    afterFor.forEach((token) => {
      entities.forEach((type, entity) => {
        if (
          token === entity ||
          (productKnowledgeGraph[entity].attributes.aliases &&
            Array.isArray(productKnowledgeGraph[entity].attributes.aliases) &&
            productKnowledgeGraph[entity].attributes.aliases.includes(token))
        ) {
          if (type === "demographic") {
            // Handle gender and age group
            const entityData = productKnowledgeGraph[entity];
            if (entityData.attributes.gender && !result.filters.gender) {
              result.filters.gender = entityData.attributes.gender;
              result.confidence += 0.15;
            }
            if (entityData.attributes.ageGroup && !result.filters.ageGroup) {
              result.filters.ageGroup = entityData.attributes.ageGroup;
              result.confidence += 0.1;
            }
          } else if (type === "relationship") {
            result.confidence += 0.1;
          }
        }
      });
    });

    // Process product categories before "for"
    beforeFor.forEach((token) => {
      entities.forEach((type, entity) => {
        if (
          (token === entity || entity.includes(token)) &&
          (type === "category" || type === "subcategory")
        ) {
          result.confidence += 0.05; // Bonus for explicit "X for Y" pattern
        }
      });
    });
  }

  // "Best X" or "Top X" pattern
  const qualityIndicators = [
    "best",
    "top",
    "premium",
    "quality",
    "high-end",
    "luxury",
  ];
  qualityIndicators.forEach((indicator) => {
    if (tokens.includes(indicator)) {
      result.filters.quality = "high";
      result.confidence += 0.05;
    }
  });

  // "Cheap X" or "Affordable X" pattern
  const affordabilityIndicators = [
    "cheap",
    "affordable",
    "budget",
    "inexpensive",
    "low-cost",
    "discounted",
  ];
  affordabilityIndicators.forEach((indicator) => {
    if (tokens.includes(indicator)) {
      result.filters.priceRange = "low";
      result.confidence += 0.05;
    }
  });
}

// Main function to convert query to filters
export async function convertQueryToFilters(
  query: string,
): Promise<QueryFilterResult> {
  // Tokenize the query
  const tokens = tokenizeQuery(query);

  // Extract entities
  const entities = extractEntities(tokens);

  // Resolve relationships and build filters
  const result = resolveRelationships(entities, tokens);

  // If confidence is low, try to enrich with database knowledge
  if (result.confidence < 0.7 && tokens.length > 0) {
    try {
      // Find relevant products in the database to improve understanding
      const products = await Product.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
          { subcategory: { $regex: query, $options: "i" } },
          { tags: { $regex: query, $options: "i" } },
        ],
      })
        .limit(5)
        .select("title category subcategory brand gender tags")
        .lean();

      if (products.length > 0) {
        // Extract most common category/subcategory from results
        const categories = products.map((p) => p.category);
        const mostCommonCategory = findMostCommon(categories);

        if (!result.filters.category && mostCommonCategory) {
          result.filters.category = mostCommonCategory;
          result.confidence += 0.15;
        }

        const subcategories = products.map((p) => p.subcategory);
        const mostCommonSubcategory = findMostCommon(subcategories);

        if (!result.filters.subcategory && mostCommonSubcategory) {
          result.filters.subcategory = mostCommonSubcategory;
          result.confidence += 0.1;
        }

        // Check for gender consistency
        const genders = products.map((p) => p.gender).filter(Boolean);
        const mostCommonGender = findMostCommon(genders);

        if (!result.filters.gender && mostCommonGender) {
          result.filters.gender = mostCommonGender;
          result.confidence += 0.05;
        }
      }
    } catch (error) {
      console.error("Error enriching query understanding:", error);
    }
  }

  return result;
}

// Helper function to find the most common item in an array
function findMostCommon(arr: (string | undefined)[]): string | undefined {
  const counts = arr.reduce(
    (acc, curr) => {
      if (!curr) return acc;
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  let mostCommon: string | undefined;
  let highestCount = 0;

  Object.entries(counts).forEach(([item, count]) => {
    if (count > highestCount) {
      mostCommon = item;
      highestCount = count;
    }
  });

  return mostCommon;
}
