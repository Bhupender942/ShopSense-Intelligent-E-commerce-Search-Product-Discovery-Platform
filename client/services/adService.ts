import { AdBanner } from "@/components/ads/AdBanner";

// Mock ad data - in production this would come from an API
export const mockAds: AdBanner[] = [
  {
    id: "ad-1",
    type: "banner",
    title: "Big Billion Days Sale",
    description: "Up to 80% off on Electronics, Fashion & More",
    image:
      "https://via.placeholder.com/800x200/ff6b35/ffffff?text=Big+Billion+Days",
    link: "/sale/big-billion-days",
    ctaText: "Shop Now",
    discount: 80,
    validUntil: "2024-12-31",
    category: "electronics",
    priority: 1,
    isActive: true,
  },
  {
    id: "ad-2",
    type: "promo",
    title: "New Smartphones",
    description: "Latest models from top brands",
    image: "https://via.placeholder.com/300x400/4f46e5/ffffff?text=Smartphones",
    link: "/category/mobiles",
    ctaText: "Explore",
    discount: 30,
    validUntil: "2024-12-31",
    category: "mobile",
    priority: 2,
    isActive: true,
  },
  {
    id: "ad-3",
    type: "sponsored",
    title: "Sponsored: Premium Headphones",
    description: "High-quality audio experience",
    image: "https://via.placeholder.com/200x200/059669/ffffff?text=Headphones",
    link: "/product/premium-headphones",
    ctaText: "Learn More",
    discount: 25,
    validUntil: "2024-12-31",
    category: "electronics",
    priority: 3,
    isActive: true,
  },
  {
    id: "ad-4",
    type: "featured",
    title: "Fashion Collection",
    description: "Trendy styles for every occasion",
    image: "https://via.placeholder.com/300x400/ec4899/ffffff?text=Fashion",
    link: "/category/fashion",
    ctaText: "Shop Fashion",
    discount: 50,
    validUntil: "2024-12-31",
    category: "clothing",
    priority: 2,
    isActive: true,
  },
  {
    id: "ad-5",
    type: "promo",
    title: "Home & Living",
    description: "Transform your space",
    image: "https://via.placeholder.com/300x400/0891b2/ffffff?text=Home+Living",
    link: "/category/home-furniture",
    ctaText: "Explore",
    discount: 40,
    validUntil: "2024-12-31",
    category: "home-furniture",
    priority: 2,
    isActive: true,
  },
  {
    id: "ad-6",
    type: "sponsored",
    title: "Sponsored: Gaming Laptop",
    description: "Ultimate gaming performance",
    image:
      "https://via.placeholder.com/200x200/7c3aed/ffffff?text=Gaming+Laptop",
    link: "/product/gaming-laptop",
    ctaText: "View Details",
    discount: 20,
    validUntil: "2024-12-31",
    category: "electronics",
    priority: 3,
    isActive: true,
  },
];

export class AdService {
  private static instance: AdService;
  private ads: AdBanner[] = mockAds;

  private constructor() {}

  static getInstance(): AdService {
    if (!AdService.instance) {
      AdService.instance = new AdService();
    }
    return AdService.instance;
  }

  // Get ads by type
  getAdsByType(type: AdBanner["type"]): AdBanner[] {
    return this.ads.filter((ad) => ad.type === type && ad.isActive);
  }

  // Get ads by category
  getAdsByCategory(category: string): AdBanner[] {
    return this.ads.filter(
      (ad) =>
        ad.category === category &&
        ad.isActive &&
        (!ad.validUntil || new Date(ad.validUntil) > new Date()),
    );
  }

  // Get top priority ads
  getTopAds(limit: number = 3): AdBanner[] {
    return this.ads
      .filter(
        (ad) =>
          ad.isActive &&
          (!ad.validUntil || new Date(ad.validUntil) > new Date()),
      )
      .sort((a, b) => a.priority - b.priority)
      .slice(0, limit);
  }

  // Get sponsored ads
  getSponsoredAds(limit: number = 6): AdBanner[] {
    return this.getAdsByType("sponsored").slice(0, limit);
  }

  // Get promotional ads
  getPromotionalAds(limit: number = 3): AdBanner[] {
    return this.getAdsByType("promo").slice(0, limit);
  }

  // Get all active ads
  getAllActiveAds(): AdBanner[] {
    return this.ads.filter(
      (ad) =>
        ad.isActive && (!ad.validUntil || new Date(ad.validUntil) > new Date()),
    );
  }

  // Add new ad
  addAd(ad: AdBanner): void {
    this.ads.push(ad);
  }

  // Update ad
  updateAd(id: string, updates: Partial<AdBanner>): void {
    const index = this.ads.findIndex((ad) => ad.id === id);
    if (index !== -1) {
      this.ads[index] = { ...this.ads[index], ...updates };
    }
  }

  // Remove ad
  removeAd(id: string): void {
    this.ads = this.ads.filter((ad) => ad.id !== id);
  }

  // Get ads for search results page
  getSearchResultsAds(
    searchQuery?: string,
    category?: string,
  ): {
    topBanner: AdBanner[];
    sidebarAds: AdBanner[];
    productAds: AdBanner[];
  } {
    const topBanner = this.getAdsByType("banner");
    const sidebarAds = this.getPromotionalAds(3);

    // Get category-specific ads if available
    let productAds = this.getAdsByType("sponsored");
    if (category) {
      const categoryAds = this.getAdsByCategory(category);
      if (categoryAds.length > 0) {
        productAds = categoryAds;
      }
    }

    return {
      topBanner,
      sidebarAds,
      productAds: productAds.slice(0, 6),
    };
  }
}

export const adService = AdService.getInstance();
