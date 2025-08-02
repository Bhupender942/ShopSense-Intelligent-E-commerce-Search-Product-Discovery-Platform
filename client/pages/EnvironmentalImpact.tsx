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
import { Leaf, Recycle, Globe, TrendingUp, Zap, Droplets } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";

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
    loadEcoFriendlyProducts();
  }, [currentPage]);

  useEffect(() => {
    loadCategoryImpact();
  }, [selectedCategory]);

  const loadEcoFriendlyProducts = async () => {
    try {
      setLoading(true);
      const response = await environmentalService.getEcoFriendlyProducts(
        currentPage,
        12,
      );
      setEcoFriendlyProducts(response.products);
    } catch (error) {
      console.error("Error loading eco-friendly products:", error);
    } finally {
      setLoading(false);
    }
  };

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
      await loadEcoFriendlyProducts();
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Environmental Impact Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover eco-friendly products and understand their environmental
            footprint. Make informed decisions for a sustainable future.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={updateAllProducts}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            <Leaf className="h-4 w-4 mr-2" />
            Update Environmental Data
          </Button>
        </div>

        {/* Category Impact Section */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Category Environmental Impact
              </CardTitle>
              <CardDescription>
                Select a category to view average environmental metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4 overflow-x-auto">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    onClick={() => setSelectedCategory(category)}
                    className="whitespace-nowrap"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {categoryImpact && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">
                        CO₂ Emissions
                      </span>
                    </div>
                    <div
                      className={`text-2xl font-bold ${getImpactColor(100 - categoryImpact.averageImpact.co2Emissions * 10)}`}
                    >
                      {categoryImpact.averageImpact.co2Emissions} kg CO₂e
                    </div>
                  </div>

                  <div className="bg-cyan-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="h-4 w-4 text-cyan-600" />
                      <span className="font-medium text-cyan-800">
                        Water Footprint
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-cyan-600">
                      {categoryImpact.averageImpact.waterFootprint.toLocaleString()}{" "}
                      L
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">
                        Energy
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {categoryImpact.averageImpact.energyConsumption} kWh
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Leaf className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">
                        Eco Score
                      </span>
                    </div>
                    <div
                      className={`text-2xl font-bold ${getImpactColor(categoryImpact.averageImpact.ecoFriendlyScore)}`}
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
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                Eco-Friendly Products
              </CardTitle>
              <CardDescription>
                Products with high environmental scores and sustainable features
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">
                    Loading eco-friendly products...
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ecoFriendlyProducts.map((product) => (
                    <div key={product._id} className="relative">
                      <ProductCard product={product} />
                      {product.environmentalMetrics && (
                        <div className="absolute top-2 right-2">
                          <EnvironmentalBadge
                            metrics={product.environmentalMetrics}
                            size="sm"
                            showDetails={false}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              <div className="flex justify-center mt-6">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={ecoFriendlyProducts.length < 12}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Environmental Tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Leaf className="h-5 w-5" />
                Choose Sustainable Materials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700">
                Look for products made from organic cotton, bamboo, hemp, or
                recycled materials. These materials have lower environmental
                impact and are often more durable.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Recycle className="h-5 w-5" />
                Check Recyclability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700">
                Choose products with high recyclability scores. This ensures
                that the product can be properly disposed of and reused,
                reducing waste in landfills.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Globe className="h-5 w-5" />
                Consider Manufacturing Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700">
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
