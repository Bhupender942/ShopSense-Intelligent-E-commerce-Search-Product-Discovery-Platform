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
  Electronics: {
    type: "category",
    attributes: {
      subcategories: [
        "Smartphones",
        "Laptops",
        "Televisions",
        "Cameras",
        "Audio",
        "Wearables",
        "Computer Accessories",
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
  Clothing: {
    type: "category",
    attributes: {
      subcategories: [
        "T-Shirts",
        "Shirts",
        "Trousers",
        "Jeans",
        "Kurtas",
        "Sarees",
        "Dresses",
        "Tops",
        "Jackets",
      ],
      gender: ["Men", "Women", "Unisex"],
      relatedTerms: ["wear", "apparel", "clothes", "garments", "outfit"],
    },
  },
  Footwear: {
    type: "category",
    attributes: {
      subcategories: [
        "Casual Shoes",
        "Sports Shoes",
        "Formal Shoes",
        "Sandals",
        "Flip Flops",
        "Boots",
      ],
      gender: ["Men", "Women", "Unisex"],
      relatedTerms: ["shoes", "footwears", "slippers", "shoe", "sandal"],
    },
  },
  Appliances: {
    type: "category",
    attributes: {
      subcategories: [
        "Refrigerators",
        "Washing Machines",
        "Air Conditioners",
        "Microwaves",
        "Water Purifiers",
      ],
      relatedTerms: ["home appliance", "appliance", "electronic", "household"],
    },
  },
  "Beauty & Personal Care": {
    type: "category",
    attributes: {
      subcategories: [
        "Skincare",
        "Haircare",
        "Makeup",
        "Fragrances",
        "Grooming",
      ],
      gender: ["Men", "Women", "Unisex"],
      relatedTerms: ["beauty", "personal care", "cosmetics", "grooming"],
    },
  },
  "Home & Furniture": {
    type: "category",
    attributes: {
      subcategories: [
        "Beds",
        "Sofas",
        "Dining Tables",
        "Wardrobes",
        "Kitchen & Dining",
        "Home Decor",
      ],
      relatedTerms: ["furniture", "home", "decor", "interior", "household"],
    },
  },
  "Sports & Fitness": {
    type: "category",
    attributes: {
      subcategories: [
        "Exercise Equipment",
        "Sports Wear",
        "Outdoor Sports",
        "Fitness Gadgets",
        "Yoga",
      ],
      gender: ["Men", "Women", "Unisex"],
      relatedTerms: ["gym", "fitness", "workout", "sports", "athletic"],
    },
  },
  Books: {
    type: "category",
    attributes: {
      subcategories: [
        "Fiction",
        "Non-Fiction",
        "Educational",
        "Comics",
        "Biography",
      ],
      relatedTerms: ["book", "reading", "novel", "literature", "text"],
    },
  },
  "Toys & Baby": {
    type: "category",
    attributes: {
      subcategories: [
        "Toys",
        "Baby Care",
        "School Supplies",
        "Remote Control Toys",
        "Outdoor Play",
      ],
      gender: ["Boys", "Girls", "Unisex"],
      relatedTerms: ["kids", "child", "toy", "baby products", "infant"],
    },
  },

  // Electronics Subcategories
  Smartphones: {
    type: "subcategory",
    attributes: {
      parentCategory: "Electronics",
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
      aliases: [
        "mobile",
        "phone",
        "cell phone",
        "mobiles",
        "phones",
        "smartphone",
      ],
    },
  },
  Laptops: {
    type: "subcategory",
    attributes: {
      parentCategory: "Electronics",
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
  Televisions: {
    type: "subcategory",
    attributes: {
      parentCategory: "Electronics",
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
  Cameras: {
    type: "subcategory",
    attributes: {
      parentCategory: "Electronics",
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
  Shoes: {
    type: "subcategory",
    attributes: {
      parentCategory: "Footwear",
      gender: ["Men", "Women", "Unisex"],
      aliases: ["shoe", "footwear"],
    },
  },
  "Casual Shoes": {
    type: "subcategory",
    attributes: {
      parentCategory: "Footwear",
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
      idealFor: ["Men", "Women", "Unisex"],
      aliases: ["casual shoe", "everyday shoes", "sneakers", "sneaker"],
    },
  },
  "Sports Shoes": {
    type: "subcategory",
    attributes: {
      parentCategory: "Footwear",
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
      idealFor: ["Men", "Women", "Unisex"],
      aliases: [
        "running shoes",
        "athletic shoes",
        "sports footwear",
        "training shoes",
        "sneakers",
        "sneaker",
      ],
    },
  },
  "Formal Shoes": {
    type: "subcategory",
    attributes: {
      parentCategory: "Footwear",
      brands: [
        "clarks",
        "bata",
        "red tape",
        "hush puppies",
        "lee cooper",
        "arrow",
        "louis philippe",
      ],
      idealFor: ["Men", "Women"],
      aliases: [
        "formal footwear",
        "dress shoes",
        "formal wear shoes",
        "leather shoes",
        "office shoes",
      ],
    },
  },
  Sandals: {
    type: "subcategory",
    attributes: {
      parentCategory: "Footwear",
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
      idealFor: ["Men", "Women", "Unisex"],
      aliases: ["flip flops", "sandal", "open shoes", "slippers", "flats"],
    },
  },
  "Flip Flops": {
    type: "subcategory",
    attributes: {
      parentCategory: "Footwear",
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
      idealFor: ["Men", "Women", "Unisex"],
      aliases: ["slippers", "hawaii chappal", "beach slippers", "flip flop"],
    },
  },
  Boots: {
    type: "subcategory",
    attributes: {
      parentCategory: "Footwear",
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
      idealFor: ["Men", "Women", "Unisex"],
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
  "T-Shirts": {
    type: "subcategory",
    attributes: {
      parentCategory: "Clothing",
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
      idealFor: ["Men", "Women", "Unisex"],
      aliases: ["tee", "t shirt", "tshirt", "t-shirt"],
    },
  },
  Shirts: {
    type: "subcategory",
    attributes: {
      parentCategory: "Clothing",
      brands: [
        "allen solly",
        "peter england",
        "louis philippe",
        "van heusen",
        "arrow",
        "park avenue",
        "raymond",
      ],
      idealFor: ["Men", "Women"],
      aliases: ["shirt", "formal shirt", "casual shirt", "dress shirt"],
    },
  },
  Jeans: {
    type: "subcategory",
    attributes: {
      parentCategory: "Clothing",
      brands: [
        "levi's",
        "wrangler",
        "lee",
        "pepe jeans",
        "diesel",
        "spykar",
        "flying machine",
      ],
      idealFor: ["Men", "Women", "Unisex"],
      aliases: ["denim", "denim jeans", "jean", "pants"],
    },
  },

  // Demographics
  Men: {
    type: "demographic",
    attributes: {
      gender: "Men",
      aliases: ["man", "gents", "boys", "male", "mens", "men's", "for men"],
      categories: [
        "Clothing",
        "Footwear",
        "Sports & Fitness",
        "Beauty & Personal Care",
      ],
    },
  },
  Women: {
    type: "demographic",
    attributes: {
      gender: "Women",
      aliases: [
        "woman",
        "ladies",
        "girls",
        "female",
        "womens",
        "women's",
        "for women",
        "women",
      ],
      categories: [
        "Clothing",
        "Footwear",
        "Sports & Fitness",
        "Beauty & Personal Care",
      ],
    },
  },
  Kids: {
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
      categories: ["Clothing", "Footwear", "Toys & Baby", "Books"],
    },
  },
  Boys: {
    type: "demographic",
    attributes: {
      gender: "Boys",
      ageGroup: "children",
      aliases: ["boy", "young boys", "little boys", "boys'", "for boys"],
      categories: ["Clothing", "Footwear", "Toys & Baby"],
    },
  },
  Girls: {
    type: "demographic",
    attributes: {
      gender: "Girls",
      ageGroup: "children",
      aliases: ["girl", "young girls", "little girls", "girls'", "for girls"],
      categories: ["Clothing", "Footwear", "Toys & Baby"],
    },
  },
  Unisex: {
    type: "demographic",
    attributes: {
      gender: "Unisex",
      aliases: ["for all", "gender neutral", "both", "any gender"],
      categories: ["Clothing", "Footwear", "Sports & Fitness"],
    },
  },

  // Brands as entities
  samsung: {
    type: "brand",
    attributes: {
      categories: ["Electronics", "Appliances"],
      subcategories: [
        "Smartphones",
        "Televisions",
        "Refrigerators",
        "Washing Machines",
      ],
    },
  },
  apple: {
    type: "brand",
    attributes: {
      categories: ["Electronics"],
      subcategories: ["Smartphones", "Laptops", "Wearables"],
      aliases: ["iphone", "macbook", "mac", "ipad", "airpods"],
    },
  },
  nike: {
    type: "brand",
    attributes: {
      categories: ["Footwear", "Clothing", "Sports & Fitness"],
      subcategories: [
        "Sports Shoes",
        "Casual Shoes",
        "T-Shirts",
        "Sports Wear",
      ],
    },
  },
  adidas: {
    type: "brand",
    attributes: {
      categories: ["Footwear", "Clothing", "Sports & Fitness"],
      subcategories: [
        "Sports Shoes",
        "Casual Shoes",
        "T-Shirts",
        "Sports Wear",
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
  const entityScores = new Map<string, number>();

  // Check for multi-word entities first (like "casual shoes", "t-shirts")
  const fullQuery = tokens.join(" ");
  Object.keys(productKnowledgeGraph).forEach((entity) => {
    if (entity.includes(" ")) {
      const entityLower = entity.toLowerCase();
      if (fullQuery.includes(entityLower)) {
        entities.set(entity, productKnowledgeGraph[entity].type);
        multiWordEntities.add(entity);
        entityScores.set(entity, 10); // High score for exact multi-word matches
      }
    }
  });

  // Process individual tokens with scoring
  tokens.forEach((token) => {
    // Skip tokens that are already part of a multi-word entity
    if (
      Array.from(multiWordEntities).some((entity) => entity.includes(token))
    ) {
      return;
    }

    // Direct match - highest priority
    if (productKnowledgeGraph[token]) {
      entities.set(token, productKnowledgeGraph[token].type);
      entityScores.set(token, 9);
      return;
    }

    // Check for aliases and related terms with scoring
    Object.keys(productKnowledgeGraph).forEach((entity) => {
      // Skip if this token is already matched to this entity
      if (
        entities.has(entity) &&
        entities.get(entity) === productKnowledgeGraph[entity].type
      ) {
        return;
      }

      const entityData = productKnowledgeGraph[entity];
      let bestScore = 0;

      // Check all attributes that might contain aliases or related terms
      Object.keys(entityData.attributes).forEach((attrKey) => {
        const attr = entityData.attributes[attrKey];

        // Check arrays (aliases, related terms, etc.)
        if (Array.isArray(attr)) {
          // Exact match in aliases - high priority
          if (attr.includes(token)) {
            bestScore = Math.max(bestScore, 8);
          } else {
            // Check for partial matches in longer terms (e.g., "phone" in "smartphone")
            // But avoid matching "men" inside "women"
            const partialMatches = attr.filter((term) => {
              // Avoid matching "men" inside "women" or similar cases
              if (token === "men" && term.toLowerCase().includes("women")) {
                return false;
              }
              if (token === "women" && term.toLowerCase().includes("men")) {
                return false;
              }
              return term.includes(token) || token.includes(term);
            });
            if (partialMatches.length > 0) {
              bestScore = Math.max(bestScore, 6);
            }
          }
        }

        // Check if the token is a substring of the entity name for categories and subcategories
        if (
          (entityData.type === "category" ||
            entityData.type === "subcategory") &&
          (entity.includes(token) || token.includes(entity))
        ) {
          // Avoid matching "men" inside "women" for demographics
          if (entityData.type === "demographic") {
            if (token === "men" && entity.toLowerCase().includes("women")) {
              // Skip this match
            } else if (
              token === "women" &&
              entity.toLowerCase().includes("men")
            ) {
              // Skip this match
            } else {
              // For demographics, prioritize exact matches over substring matches
              if (entity.toLowerCase() === token.toLowerCase()) {
                bestScore = Math.max(bestScore, 9); // Exact match gets highest priority
              } else {
                bestScore = Math.max(bestScore, 6); // Substring match gets lower priority
              }
            }
          } else {
            bestScore = Math.max(bestScore, 7);
          }
        }
      });

      // Only set if we found a good match and it's better than existing
      if (bestScore > 0) {
        const currentScore = entityScores.get(entity) || 0;
        if (bestScore > currentScore) {
          entities.set(entity, entityData.type);
          entityScores.set(entity, bestScore);
        }
      }
    });
  });

  // Filter out low-confidence matches
  const filteredEntities = new Map<string, string>();
  entities.forEach((type, entity) => {
    const score = entityScores.get(entity) || 0;
    if (score >= 6) {
      // Only keep high-confidence matches
      filteredEntities.set(entity, type);
    }
  });

  return filteredEntities;
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

  // First pass: collect all entities by type
  const categories: string[] = [];
  const subcategories: string[] = [];
  const demographics: string[] = [];
  const brands: string[] = [];

  entities.forEach((type, entity) => {
    switch (type) {
      case "category":
        categories.push(entity);
        break;
      case "subcategory":
        subcategories.push(entity);
        break;
      case "demographic":
        demographics.push(entity);
        break;
      case "brand":
        brands.push(entity);
        break;
    }
  });

  // Second pass: apply filters with priority logic
  // Prioritize subcategories over categories
  if (subcategories.length > 0) {
    // Use the first subcategory found
    const subcategory = subcategories[0];
    result.filters.subcategory = subcategory;
    subcategoryFound = true;
    result.confidence += 0.2;

    // Infer parent category if not explicitly mentioned
    const entityData = productKnowledgeGraph[subcategory];
    if (!categoryFound && entityData.attributes.parentCategory) {
      result.filters.category = entityData.attributes.parentCategory;
      categoryFound = true;
      result.confidence += 0.1;
    }
  } else if (categories.length > 0) {
    // Use the first category found
    result.filters.category = categories[0];
    categoryFound = true;
    result.confidence += 0.15;
  }

  // Handle demographics
  if (demographics.length > 0) {
    // Check if there's a "for" pattern in the query
    const fullQuery = tokens.join(" ").toLowerCase();
    const forIndex = fullQuery.indexOf(" for ");

    if (forIndex !== -1) {
      // If there's a "for" pattern, find the specific demographic that comes after "for"
      const afterFor = fullQuery.substring(forIndex + 5).trim();
      console.log("After 'for':", afterFor);

      // Find the demographic that matches what comes after "for"
      let targetDemographic = null;
      for (const demo of demographics) {
        const demoLower = demo.toLowerCase();
        if (afterFor.includes(demoLower)) {
          targetDemographic = demo;
          break;
        }
        // Also check aliases
        const entityData = productKnowledgeGraph[demo];
        if (
          entityData.attributes.aliases &&
          Array.isArray(entityData.attributes.aliases)
        ) {
          for (const alias of entityData.attributes.aliases) {
            if (afterFor.includes(alias.toLowerCase())) {
              targetDemographic = demo;
              break;
            }
          }
        }
        if (targetDemographic) break;
      }

      if (targetDemographic) {
        console.log("Found target demographic:", targetDemographic);
        const entityData = productKnowledgeGraph[targetDemographic];

        // Handle gender filter
        if (entityData.attributes.gender) {
          result.filters.gender = entityData.attributes.gender;
          demographicFound = true;
          result.confidence += 0.25; // Higher confidence for explicit "for" pattern
        }

        // Handle age group filter (like "kids")
        if (entityData.attributes.ageGroup) {
          result.filters.ageGroup = entityData.attributes.ageGroup;
          result.confidence += 0.15;
        }
      } else {
        // Fall back to first demographic if no match found
        const demographic = demographics[0];
        const entityData = productKnowledgeGraph[demographic];

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
      }
    } else {
      // No "for" pattern, use first demographic
      const demographic = demographics[0];
      const entityData = productKnowledgeGraph[demographic];

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
    }
  }

  // Handle brands
  if (brands.length > 0) {
    const brand = brands[0];
    result.filters.brand = brand;
    brandFound = true;
    result.confidence += 0.2;

    // Infer categories from brand if not explicitly mentioned
    if (
      !categoryFound &&
      productKnowledgeGraph[brand].attributes.categories &&
      Array.isArray(productKnowledgeGraph[brand].attributes.categories) &&
      productKnowledgeGraph[brand].attributes.categories.length > 0
    ) {
      // Prioritize first category associated with brand
      result.filters.category =
        productKnowledgeGraph[brand].attributes.categories[0];
      categoryFound = true;
      result.confidence += 0.05;
    }

    // Infer subcategories from brand if not explicitly mentioned
    if (
      !subcategoryFound &&
      productKnowledgeGraph[brand].attributes.subcategories &&
      Array.isArray(productKnowledgeGraph[brand].attributes.subcategories) &&
      productKnowledgeGraph[brand].attributes.subcategories.length > 0
    ) {
      // Prioritize first subcategory associated with brand
      result.filters.subcategory =
        productKnowledgeGraph[brand].attributes.subcategories[0];
      subcategoryFound = true;
      result.confidence += 0.05;
    }
  }

  // Handle festivals and relationships
  entities.forEach((type, entity) => {
    if (type === "festival") {
      result.filters.category =
        productKnowledgeGraph[entity].attributes.category || entity;
      categoryFound = true;
      result.confidence += 0.2;

      // Add seasonal attribute if available
      if (productKnowledgeGraph[entity].attributes.season) {
        result.filters.season = productKnowledgeGraph[entity].attributes.season;
        result.confidence += 0.05;
      }
    }

    if (type === "relationship") {
      hasQualifier = true;
      // Process relationship entities
      entities.forEach((otherType, otherEntity) => {
        if (
          otherType === "festival" &&
          productKnowledgeGraph[entity].attributes.relatedEvents &&
          Array.isArray(
            productKnowledgeGraph[entity].attributes.relatedEvents,
          ) &&
          productKnowledgeGraph[entity].attributes.relatedEvents.includes(
            otherEntity,
          )
        ) {
          // Special case handling (like "rakhi for bhai")
          const festivalData = productKnowledgeGraph[otherEntity];
          result.filters.category = festivalData.attributes.category;
          result.confidence += 0.15;
        }
      });
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

    // Process demographic targets after "for" with higher priority
    afterFor.forEach((token) => {
      entities.forEach((type, entity) => {
        if (
          token === entity ||
          (productKnowledgeGraph[entity].attributes.aliases &&
            Array.isArray(productKnowledgeGraph[entity].attributes.aliases) &&
            productKnowledgeGraph[entity].attributes.aliases.includes(token))
        ) {
          if (type === "demographic") {
            // Handle gender and age group with higher priority
            const entityData = productKnowledgeGraph[entity];
            if (entityData.attributes.gender && !result.filters.gender) {
              result.filters.gender = entityData.attributes.gender;
              result.confidence += 0.2; // Higher confidence for explicit "for" pattern
            }
            if (entityData.attributes.ageGroup && !result.filters.ageGroup) {
              result.filters.ageGroup = entityData.attributes.ageGroup;
              result.confidence += 0.15;
            }
          } else if (type === "relationship") {
            result.confidence += 0.15;
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
          result.confidence += 0.1; // Bonus for explicit "X for Y" pattern
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
  console.log("Tokens:", tokens);

  // Extract entities
  const entities = extractEntities(tokens);
  console.log("Entities found:", Array.from(entities.entries()));

  // Resolve relationships and build filters
  const result = resolveRelationships(entities, tokens);
  console.log("Final result:", result);

  // Special handling for "for" pattern - override gender if found
  const queryLower = query.toLowerCase();
  const forIndex = queryLower.indexOf(" for ");
  if (forIndex !== -1) {
    const afterFor = queryLower.substring(forIndex + 5).trim();
    console.log("After 'for':", afterFor);

    // Check for specific demographics after "for"
    if (afterFor.includes("women") || afterFor.includes("woman")) {
      result.filters.gender = "Women";
      result.confidence += 0.1;
      console.log("Set gender to Women based on 'for' pattern");
    } else if (afterFor.includes("men") || afterFor.includes("man")) {
      result.filters.gender = "Men";
      result.confidence += 0.1;
      console.log("Set gender to Men based on 'for' pattern");
    } else if (afterFor.includes("kids") || afterFor.includes("children")) {
      result.filters.ageGroup = "children";
      result.confidence += 0.1;
      console.log("Set age group to children based on 'for' pattern");
    }
  }

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
