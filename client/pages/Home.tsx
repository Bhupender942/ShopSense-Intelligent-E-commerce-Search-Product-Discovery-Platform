import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VoiceSearch } from "@/components/ui/voice-search";
import { EnhancedSearch } from "@/components/ui/enhanced-search";
import ImageSearch from "@/components/ImageSearch";
import { useRecentSearches } from "@/hooks/use-recent-searches";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showImageSearch, setShowImageSearch] = useState(false);
  const navigate = useNavigate();
  const { addRecentSearch } = useRecentSearches();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery.trim());
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleVoiceSearchResult = (transcript: string) => {
    setSearchQuery(transcript);
    if (transcript.trim()) {
      addRecentSearch(transcript.trim());
      navigate(`/search?q=${encodeURIComponent(transcript.trim())}`);
    }
  };

  const handleImageSearch = () => {
    setShowImageSearch(true);
  };

  const handleImageSearchComplete = (
    products: any[],
    uploadedImage: string | null,
  ) => {
    // Navigate to search results with image search context
    navigate("/search?imageSearch=true", {
      state: {
        imageSearchResults: products,
        uploadedImage: uploadedImage,
      },
    });
  };

  return (
    <div className="min-h-screen bg-flipkart-blue flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl px-4">
        {/* Flipkart Logo */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-bold italic text-white mb-4">
            Flipkart
          </h1>
          <p className="text-white/80 text-lg md:text-xl">
            The One-stop Shopping Destination
          </p>
        </div>

        {/* Image Search Modal */}
        {showImageSearch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Search by Image</h2>
                  <button
                    onClick={() => setShowImageSearch(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <ImageSearch onSearchComplete={handleImageSearchComplete} />
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <EnhancedSearch
          onSearch={(query, type) => {
            const searchUrl =
              type === "category"
                ? `/search?category=${encodeURIComponent(query)}`
                : `/search?q=${encodeURIComponent(query)}`;
            navigate(searchUrl);
          }}
          onImageSearch={handleImageSearch}
          placeholder="Search for products, brands and more"
          className="w-full"
        />

        {/* Popular Categories */}
        <div className="mt-12 text-center">
          <p className="text-white/80 mb-4">Popular Categories</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Mobiles",
              "Fashion",
              "Electronics",
              "Home & Furniture",
              "Books",
              "Grocery",
            ].map((category) => (
              <button
                key={category}
                onClick={() => {
                  navigate(`/search?category=${encodeURIComponent(category)}`);
                }}
                className="px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
