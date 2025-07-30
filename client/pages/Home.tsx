import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VoiceSearch } from "@/components/ui/voice-search";
import { EnhancedSearch } from "@/components/ui/enhanced-search"; // ADD THIS LINE

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleVoiceSearchResult = (transcript: string) => {
    setSearchQuery(transcript);
    if (transcript.trim()) {
      navigate(`/search?q=${encodeURIComponent(transcript.trim())}`);
    }
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

                {/* Search Bar */}
                <EnhancedSearch
          onSearch={(query, type) => {
            const searchUrl = type === 'category' 
              ? `/search?category=${encodeURIComponent(query)}`
              : `/search?q=${encodeURIComponent(query)}`;
            navigate(searchUrl);
          }}
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
