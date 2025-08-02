import React, { useState, useEffect } from "react";
import { EnvironmentalBadge } from "@/components/ui/environmental-badge";
import {
  environmentalService,
  ProductWithEnvironmentalMetrics,
  CategoryEnvironmentalImpact,
} from "@/services/environmentalService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  Recycle,
  Globe,
  TrendingUp,
  Zap,
  Droplets,
  RefreshCw,
} from "lucide-react";
import { EnvironmentalProductCard } from "@/components/product/EnvironmentalProductCard";

// Mock random product data for demonstration
const mockProducts: ProductWithEnvironmentalMetrics[] = [
  {
    _id: "1",
    product_id: "eco-bamboo-1",
    title: "Bamboo Organic T-Shirt",
    brand: "EcoWear",
    category: "Clothing",
    price: 1299,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    ],
    environmentalMetrics: {
      co2Emissions: 2.1,
      waterFootprint: 1200,
      energyConsumption: 45,
      recyclabilityScore: 95,
      ecoFriendlyScore: 92,
      isEcoFriendly: true,
      environmentalBadge: "🌱 Eco Champion",
      sustainabilityFeatures: [
        "Bamboo (Sustainable)",
        "Organic Materials",
        "Highly Recyclable",
      ],
    },
  },
  {
    _id: "2",
    product_id: "eco-hemp-2",
    title: "Hemp Canvas Bag",
    brand: "GreenLife",
    category: "Accessories",
    price: 899,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"],
    environmentalMetrics: {
      co2Emissions: 1.8,
      waterFootprint: 800,
      energyConsumption: 32,
      recyclabilityScore: 90,
      ecoFriendlyScore: 88,
      isEcoFriendly: true,
      environmentalBadge: "🌿 Green Choice",
      sustainabilityFeatures: [
        "Hemp (Low Impact)",
        "Highly Recyclable",
        "Biodegradable",
      ],
    },
  },
  {
    _id: "3",
    product_id: "eco-organic-3",
    title: "Organic Cotton Sweater",
    brand: "Patagonia",
    category: "Clothing",
    price: 2499,
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400",
    ],
    environmentalMetrics: {
      co2Emissions: 3.2,
      waterFootprint: 2800,
      energyConsumption: 65,
      recyclabilityScore: 85,
      ecoFriendlyScore: 85,
      isEcoFriendly: true,
      environmentalBadge: "🌿 Green Choice",
      sustainabilityFeatures: [
        "Organic Materials",
        "Highly Recyclable",
        "Natural Fibers",
      ],
    },
  },
  {
    _id: "4",
    product_id: "eco-recycled-4",
    title: "Recycled Plastic Water Bottle",
    brand: "EcoBottle",
    category: "Home & Kitchen",
    price: 599,
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
    ],
    environmentalMetrics: {
      co2Emissions: 1.5,
      waterFootprint: 150,
      energyConsumption: 25,
      recyclabilityScore: 75,
      ecoFriendlyScore: 78,
      isEcoFriendly: true,
      environmentalBadge: "♻️ Eco Friendly",
      sustainabilityFeatures: ["Recycled Content", "Recyclable", "BPA Free"],
    },
  },
  {
    _id: "5",
    product_id: "eco-linen-5",
    title: "Linen Table Cloth",
    brand: "NaturalHome",
    category: "Home & Kitchen",
    price: 799,
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
    ],
    environmentalMetrics: {
      co2Emissions: 2.8,
      waterFootprint: 1800,
      energyConsumption: 55,
      recyclabilityScore: 80,
      ecoFriendlyScore: 82,
      isEcoFriendly: true,
      environmentalBadge: "🌿 Green Choice",
      sustainabilityFeatures: ["Natural Fibers", "Recyclable", "Durable"],
    },
  },
  {
    _id: "6",
    product_id: "eco-bamboo-6",
    title: "Bamboo Cutlery Set",
    brand: "EcoKitchen",
    category: "Home & Kitchen",
    price: 399,
    images: [
      "https://images.unsplash.com/photo-1582735689369-4fe89db71103?w=400",
    ],
    environmentalMetrics: {
      co2Emissions: 1.2,
      waterFootprint: 600,
      energyConsumption: 20,
      recyclabilityScore: 95,
      ecoFriendlyScore: 94,
      isEcoFriendly: true,
      environmentalBadge: "🌱 Eco Champion",
      sustainabilityFeatures: [
        "Bamboo (Sustainable)",
        "Biodegradable",
        "Highly Recyclable",
      ],
    },
  },
  {
    _id: "7",
    product_id: "eco-wool-7",
    title: "Organic Wool Scarf",
    brand: "WoolCraft",
    category: "Clothing",
    price: 1599,
    images: ["https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400"],
    environmentalMetrics: {
      co2Emissions: 4.1,
      waterFootprint: 3500,
      energyConsumption: 85,
      recyclabilityScore: 70,
      ecoFriendlyScore: 72,
      isEcoFriendly: true,
      environmentalBadge: "♻️ Eco Friendly",
      sustainabilityFeatures: [
        "Natural Fibers",
        "Recyclable",
        "Warm & Durable",
      ],
    },
  },
  {
    _id: "8",
    product_id: "eco-paper-8",
    title: "Recycled Paper Notebook",
    brand: "EcoPaper",
    category: "Books",
    price: 299,
    images: [
      "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=400",
    ],
    environmentalMetrics: {
      co2Emissions: 0.8,
      waterFootprint: 400,
      energyConsumption: 15,
      recyclabilityScore: 90,
      ecoFriendlyScore: 89,
      isEcoFriendly: true,
      environmentalBadge: "🌿 Green Choice",
      sustainabilityFeatures: [
        "Recycled Content",
        "Highly Recyclable",
        "Biodegradable",
      ],
    },
  },
  {
    _id: "9",
    product_id: "eco-cotton-9",
    title: "Organic Cotton Towel",
    brand: "BathEco",
    category: "Home & Kitchen",
    price: 899,
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
    environmentalMetrics: {
      co2Emissions: 2.5,
      waterFootprint: 2200,
      energyConsumption: 50,
      recyclabilityScore: 85,
      ecoFriendlyScore: 81,
      isEcoFriendly: true,
      environmentalBadge: "🌿 Green Choice",
      sustainabilityFeatures: [
        "Organic Materials",
        "Highly Recyclable",
        "Absorbent",
      ],
    },
  },
  {
    _id: "10",
    product_id: "eco-jute-10",
    title: "Jute Shopping Bag",
    brand: "JuteLife",
    category: "Accessories",
    price: 199,
    images: [
      "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=400",
    ],
    environmentalMetrics: {
      co2Emissions: 1.1,
      waterFootprint: 500,
      energyConsumption: 18,
      recyclabilityScore: 95,
      ecoFriendlyScore: 93,
      isEcoFriendly: true,
      environmentalBadge: "🌱 Eco Champion",
      sustainabilityFeatures: [
        "Natural Fibers",
        "Biodegradable",
        "Highly Recyclable",
      ],
    },
  },
  {
    _id: "11",
    product_id: "eco-silk-11",
    title: "Silk Scarf",
    brand: "SilkEco",
    category: "Clothing",
    price: 1899,
    images: [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400",
    ],
    environmentalMetrics: {
      co2Emissions: 3.8,
      waterFootprint: 2800,
      energyConsumption: 75,
      recyclabilityScore: 60,
      ecoFriendlyScore: 68,
      isEcoFriendly: false,
      environmentalBadge: "🌍 Moderate Impact",
      sustainabilityFeatures: [
        "Natural Fibers",
        "Recyclable",
        "Luxury Material",
      ],
    },
  },
  {
    _id: "12",
    product_id: "eco-metal-12",
    title: "Stainless Steel Water Bottle",
    brand: "MetalEco",
    category: "Home & Kitchen",
    price: 1299,
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
    ],
    environmentalMetrics: {
      co2Emissions: 2.2,
      waterFootprint: 800,
      energyConsumption: 35,
      recyclabilityScore: 90,
      ecoFriendlyScore: 84,
      isEcoFriendly: true,
      environmentalBadge: "🌿 Green Choice",
      sustainabilityFeatures: ["Highly Recyclable", "Durable", "Reusable"],
    },
  },
];

const EnvironmentalImpact: React.FC = () => {
  const [ecoFriendlyProducts, setEcoFriendlyProducts] = useState<
    ProductWithEnvironmentalMetrics[]
  >([]);
  const [categoryImpact, setCategoryImpact] =
    useState<CategoryEnvironmentalImpact | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Clothing");
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    "Clothing",
    "Electronics",
    "Home & Kitchen",
    "Sports & Fitness",
    "Beauty & Personal Care",
    "Books",
    "Toys & Games",
  ];

  useEffect(() => {
    // Use mock data as real data
    setEcoFriendlyProducts(mockProducts);
    setLoading(false);
  }, [currentPage]);

  useEffect(() => {
    loadCategoryImpact();
  }, [selectedCategory]);

  const loadCategoryImpact = async () => {
    try {
      const response =
        await environmentalService.getEnvironmentalImpactByCategory(
          selectedCategory,
        );
      setCategoryImpact({
        category: response.category,
        averageImpact: response.averageImpact,
        products: response.products,
      });
    } catch (error) {
      console.error("Error loading category impact:", error);
    }
  };

  const updateAllProducts = async () => {
    try {
      setLoading(true);
      await environmentalService.updateAllProductsEnvironmentalImpact();
      await loadCategoryImpact();
    } catch (error) {
      console.error("Error updating products:", error);
    } finally {
      setLoading(false);
    }
  };

  const getImpactColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <Leaf className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Environmental Impact Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover eco-friendly products and understand their environmental
            footprint. Make informed decisions for a sustainable future.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Button
            onClick={updateAllProducts}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Leaf className="h-5 w-5 mr-3" />
            Update Environmental Data
          </Button>
        </div>

        {/* Category Impact Section */}
        <div className="mb-16">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-8">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Globe className="h-7 w-7 text-blue-600" />
                Category Environmental Impact
              </CardTitle>
              <CardDescription className="text-lg">
                Select a category to view average environmental metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex gap-3 mb-8 overflow-x-auto pb-4">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    onClick={() => setSelectedCategory(category)}
                    className="whitespace-nowrap px-6 py-3 text-base font-medium rounded-xl"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {categoryImpact && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="h-6 w-6 text-blue-600" />
                      <span className="font-semibold text-blue-800 text-lg">
                        CO₂ Emissions
                      </span>
                    </div>
                    <div
                      className={`text-3xl font-bold ${getImpactColor(100 - categoryImpact.averageImpact.co2Emissions * 10)}`}
                    >
                      {categoryImpact.averageImpact.co2Emissions} kg CO₂e
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 rounded-2xl border border-cyan-200 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Droplets className="h-6 w-6 text-cyan-600" />
                      <span className="font-semibold text-cyan-800 text-lg">
                        Water Footprint
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-cyan-600">
                      {categoryImpact.averageImpact.waterFootprint.toLocaleString()}{" "}
                      L
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl border border-yellow-200 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Zap className="h-6 w-6 text-yellow-600" />
                      <span className="font-semibold text-yellow-800 text-lg">
                        Energy
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-yellow-600">
                      {categoryImpact.averageImpact.energyConsumption} kWh
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Leaf className="h-6 w-6 text-green-600" />
                      <span className="font-semibold text-green-800 text-lg">
                        Eco Score
                      </span>
                    </div>
                    <div
                      className={`text-3xl font-bold ${getImpactColor(categoryImpact.averageImpact.ecoFriendlyScore)}`}
                    >
                      {categoryImpact.averageImpact.ecoFriendlyScore}/100
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Eco-Friendly Products Section */}
        <div className="mb-16">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-8">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Leaf className="h-7 w-7 text-green-600" />
                Eco-Friendly Products
              </CardTitle>
              <CardDescription className="text-lg">
                Products with high environmental scores and sustainable features
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 text-lg">
                    Loading eco-friendly products...
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {ecoFriendlyProducts.map((product) => (
                    <EnvironmentalProductCard
                      key={product._id}
                      product={product}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Environmental Tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-green-800 text-xl">
                <Leaf className="h-6 w-6" />
                Choose Sustainable Materials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 text-base leading-relaxed">
                Look for products made from organic cotton, bamboo, hemp, or
                recycled materials. These materials have lower environmental
                impact and are often more durable.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-blue-800 text-xl">
                <Recycle className="h-6 w-6" />
                Check Recyclability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 text-base leading-relaxed">
                Choose products with high recyclability scores. This ensures
                that the product can be properly disposed of and reused,
                reducing waste in landfills.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-purple-800 text-xl">
                <Globe className="h-6 w-6" />
                Consider Manufacturing Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700 text-base leading-relaxed">
                Products manufactured in countries with stricter environmental
                regulations often have lower carbon footprints and better
                sustainability practices.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalImpact;
