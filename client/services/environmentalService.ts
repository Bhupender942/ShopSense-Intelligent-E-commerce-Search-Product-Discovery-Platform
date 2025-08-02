const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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

export interface ProductWithEnvironmentalMetrics {
  _id: string;
  product_id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  images: string[];
  environmentalMetrics: EnvironmentalMetrics;
}

export interface EnvironmentalComparison {
  product_id: string;
  title: string;
  brand: string;
  category: string;
  environmentalMetrics: EnvironmentalMetrics;
}

export interface CategoryEnvironmentalImpact {
  category: string;
  averageImpact: {
    co2Emissions: number;
    waterFootprint: number;
    energyConsumption: number;
    ecoFriendlyScore: number;
    productCount: number;
  };
  products: ProductWithEnvironmentalMetrics[];
}

class EnvironmentalService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE_URL}/environmental${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async calculateProductEnvironmentalImpact(
    productId: string,
  ): Promise<{
    success: boolean;
    environmentalMetrics: EnvironmentalMetrics;
    message: string;
  }> {
    return this.makeRequest(`/product/${productId}`);
  }

  async updateAllProductsEnvironmentalImpact(): Promise<{
    success: boolean;
    message: string;
    updatedCount: number;
  }> {
    return this.makeRequest("/update-all", { method: "POST" });
  }

  async getEcoFriendlyProducts(
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    success: boolean;
    products: ProductWithEnvironmentalMetrics[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return this.makeRequest(`/eco-friendly?page=${page}&limit=${limit}`);
  }

  async getEnvironmentalImpactByCategory(category: string): Promise<{
    success: boolean;
    category: string;
    averageImpact: {
      co2Emissions: number;
      waterFootprint: number;
      energyConsumption: number;
      ecoFriendlyScore: number;
      productCount: number;
    };
    products: ProductWithEnvironmentalMetrics[];
  }> {
    return this.makeRequest(`/category/${encodeURIComponent(category)}`);
  }

  async compareEnvironmentalImpact(productIds: string[]): Promise<{
    success: boolean;
    comparison: EnvironmentalComparison[];
  }> {
    return this.makeRequest("/compare", {
      method: "POST",
      body: JSON.stringify({ productIds }),
    });
  }
}

export const environmentalService = new EnvironmentalService();
