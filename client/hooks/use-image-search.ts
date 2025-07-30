import { useState, useCallback } from "react";

interface Product {
  _id: string;
  product_id: string;
  title: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  original_price: number;
  discount_percentage: number;
  average_rating: number;
  rating_count: number;
  availability: string;
  images: string[];
  popularity_score: number;
}

interface ImageSearchResult {
  products: Product[];
  uploadedImage: string;
  message: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface UseImageSearchResult {
  searchResults: Product[];
  uploadedImage: string | null;
  isLoading: boolean;
  error: string | null;
  pagination: any;
  searchByImage: (
    file: File,
    category?: string,
  ) => Promise<ImageSearchResult | null>;
}

const API_URL = import.meta.env.VITE_API_URL || "/api";

export function useImageSearch(): UseImageSearchResult {
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchByImage = useCallback(
    async (
      file: File,
      category?: string,
    ): Promise<ImageSearchResult | null> => {
      if (!file) return null;

      setIsLoading(true);
      setError(null);

      try {
        console.log(
          "Starting image search with file:",
          file.name,
          "category:",
          category,
        );

        const formData = new FormData();
        formData.append("image", file);

        if (category) {
          formData.append("category", category);
        }

        // Log the API URL for debugging
        console.log(`Sending request to: ${API_URL}/image-search`);

        const response = await fetch(`${API_URL}/image-search`, {
          method: "POST",
          body: formData,
          credentials: "include", // Include cookies for authentication
        });

        if (!response.ok) {
          console.error(`Image search failed with status: ${response.status}`);
          throw new Error(`Image search failed: ${response.statusText}`);
        }

        const result: ImageSearchResult = await response.json();
        console.log("Image search results:", result);

        setSearchResults(result.products);
        setUploadedImage(result.uploadedImage);
        setPagination(result.pagination);

        return result;
      } catch (err) {
        console.error("Error in image search:", err);
        setError(
          err instanceof Error ? err.message : "Failed to search by image",
        );
        setSearchResults([]);
        setUploadedImage(null);
        setPagination(null);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    searchResults,
    uploadedImage,
    isLoading,
    error,
    pagination,
    searchByImage,
  };
}
