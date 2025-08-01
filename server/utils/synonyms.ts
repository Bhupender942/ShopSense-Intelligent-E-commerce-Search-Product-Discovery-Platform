// Simple synonym mapping for popular e-commerce searches
const synonymMap: Record<string, string> = {
  // Footwear/Shoes (max 30)
  shoes: "footwear",
  sneakers: "footwear",
  boots: "footwear",
  sandals: "footwear",
  "flip flops": "footwear",
  slippers: "footwear",
  "running shoes": "footwear",
  "sports shoes": "footwear",
  "casual shoes": "footwear",
  "formal shoes": "footwear",
  heels: "footwear",
  pumps: "footwear",
  loafers: "footwear",
  oxfords: "footwear",
  mules: "footwear",
  espadrilles: "footwear",
  trainers: "footwear",
  "athletic shoes": "footwear",
  "walking shoes": "footwear",
  "dress shoes": "footwear",
  "workout shoes": "footwear",
  "gym shoes": "footwear",
  "tennis shoes": "footwear",
  "basketball shoes": "footwear",
  "football shoes": "footwear",
  "cricket shoes": "footwear",
  "hiking boots": "footwear",
  "winter boots": "footwear",
  "ankle boots": "footwear",
  "knee high boots": "footwear",

  // Clothing (max 30)
  shirt: "clothing",
  tshirt: "clothing",
  "t-shirt": "clothing",
  pants: "clothing",
  jeans: "clothing",
  dress: "clothing",
  kurta: "clothing",
  saree: "clothing",
  salwar: "clothing",
  kameez: "clothing",
  suit: "clothing",
  blazer: "clothing",
  jacket: "clothing",
  hoodie: "clothing",
  sweater: "clothing",
  cardigan: "clothing",
  blouse: "clothing",
  top: "clothing",
  "tank top": "clothing",
  shorts: "clothing",
  skirt: "clothing",
  lehenga: "clothing",
  anarkali: "clothing",
  palazzo: "clothing",
  churidar: "clothing",
  dupatta: "clothing",
  scarf: "clothing",
  stole: "clothing",
  shawl: "clothing",
  tie: "clothing",
  belt: "clothing",

  // Mobile/Electronics (max 30)
  mobile: "electronics",
  phone: "electronics",
  smartphone: "electronics",
  iphone: "electronics",
  android: "electronics",
  samsung: "electronics",
  xiaomi: "electronics",
  oneplus: "electronics",
  oppo: "electronics",
  vivo: "electronics",
  realme: "electronics",
  nokia: "electronics",
  motorola: "electronics",
  "google pixel": "electronics",
  "cell phone": "electronics",
  cellular: "electronics",
  handset: "electronics",
  "mobile phone": "electronics",
  "smart phone": "electronics",
  "5g phone": "electronics",
  "4g phone": "electronics",
  "gaming phone": "electronics",
  "camera phone": "electronics",
  "dual sim": "electronics",
  "triple camera": "electronics",
  "quad camera": "electronics",
  "fast charging": "electronics",
  "wireless charging": "electronics",
  "waterproof phone": "electronics",
  "rugged phone": "electronics",

  // Electronics (max 30)
  laptop: "electronics",
  computer: "electronics",
  desktop: "electronics",
  tablet: "electronics",
  ipad: "electronics",
  headphones: "electronics",
  earphones: "electronics",
  speakers: "electronics",
  tv: "electronics",
  television: "electronics",
  refrigerator: "electronics",
  "washing machine": "electronics",
  ac: "electronics",
  "air conditioner": "electronics",
  microwave: "electronics",
  oven: "electronics",
  mixer: "electronics",
  grinder: "electronics",
  iron: "electronics",
  fan: "electronics",
  bulb: "electronics",
  led: "electronics",
  camera: "electronics",
  printer: "electronics",
  scanner: "electronics",
  keyboard: "electronics",
  mouse: "electronics",
  monitor: "electronics",
  webcam: "electronics",
  router: "electronics",
  modem: "electronics",

  // Toys (max 30)
  toy: "toys & baby",
  game: "toys & baby",
  puzzle: "toys & baby",
  lego: "toys & baby",
  barbie: "toys & baby",
  doll: "toys & baby",
  car: "toys & baby",
  "remote control": "toys & baby",
  "rc car": "toys & baby",
  drone: "toys & baby",
  robot: "toys & baby",
  "action figure": "toys & baby",
  "board game": "toys & baby",
  "card game": "toys & baby",
  chess: "toys & baby",
  ludo: "toys & baby",
  snake: "toys & baby",
  blocks: "toys & baby",
  "building blocks": "toys & baby",
  "stuffed animal": "toys & baby",
  "teddy bear": "toys & baby",
  train: "toys & baby",
  plane: "toys & baby",
  helicopter: "toys & baby",
  bike: "toys & baby",
  bicycle: "toys & baby",
  skateboard: "toys & baby",
  "roller skates": "toys & baby",
  trampoline: "toys & baby",
  swing: "toys & baby",
  slide: "toys & baby",
};

/**
 * Process search query and replace synonyms with database categories
 * @param query - User search query
 * @returns Processed query with synonyms replaced
 */
export function processSearchQuery(query: string): string {
  if (!query || typeof query !== "string") {
    return query;
  }

  const words = query.toLowerCase().trim().split(/\s+/);
  const processedWords: string[] = [];

  for (const word of words) {
    // Check if word exists in synonym map
    if (synonymMap[word]) {
      processedWords.push(synonymMap[word]);
    } else {
      // Keep original word if no synonym found
      processedWords.push(word);
    }
  }

  return processedWords.join(" ");
}

/**
 * Get all synonyms for a given category
 * @param category - Database category
 * @returns Array of synonyms for that category
 */
export function getSynonymsForCategory(category: string): string[] {
  const synonyms: string[] = [];

  for (const [synonym, mappedCategory] of Object.entries(synonymMap)) {
    if (mappedCategory.toLowerCase() === category.toLowerCase()) {
      synonyms.push(synonym);
    }
  }

  return synonyms;
}

/**
 * Check if a word is a synonym
 * @param word - Word to check
 * @returns True if word is a synonym
 */
export function isSynonym(word: string): boolean {
  return word.toLowerCase() in synonymMap;
}

/**
 * Get the mapped category for a synonym
 * @param synonym - Synonym word
 * @returns Mapped category or null if not found
 */
export function getCategoryForSynonym(synonym: string): string | null {
  return synonymMap[synonym.toLowerCase()] || null;
}
