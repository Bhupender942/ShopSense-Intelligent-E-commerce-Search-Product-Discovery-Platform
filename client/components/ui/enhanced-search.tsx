import React, { useState } from "react";
import { Search, Image as ImageIcon } from "lucide-react";
import { Button } from "./button";
import { Autosuggest } from "./autosuggest";
import { VoiceSearch } from "./voice-search";
import { trackSearchAnalytics } from "@/hooks/use-autosuggest";

interface EnhancedSearchProps {
  onSearch: (query: string, type?: string) => void;
  onImageSearch?: () => void;
  placeholder?: string;
  className?: string;
  category?: string;
  showVoiceSearch?: boolean;
  showImageSearch?: boolean;
}

export const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  onSearch,
  onImageSearch,
  placeholder = "Search for products, brands and more",
  className = "",
  category,
  showVoiceSearch = true,
  showImageSearch = true,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (query: string = searchQuery, type?: string) => {
    if (query.trim()) {
      await trackSearchAnalytics(query.trim(), "search", category);
      onSearch(query.trim(), type);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleVoiceResult = (transcript: string) => {
    setSearchQuery(transcript);
    handleSearch(transcript);
  };

  const handleSuggestionSelect = (query: string, type?: string) => {
    setSearchQuery(query);
    handleSearch(query, type);
  };

  const handleImageSearch = () => {
    if (onImageSearch) {
      onImageSearch();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Autosuggest
        value={searchQuery}
        onChange={setSearchQuery}
        onSelect={handleSuggestionSelect}
        placeholder={placeholder}
        category={category}
        className="w-full"
      />

      <div className="absolute right-0 top-0 h-full flex">
        {showVoiceSearch && (
          <VoiceSearch
            onResult={handleVoiceResult}
            className="flex items-center h-full px-1"
          />
        )}
        {showImageSearch && onImageSearch && (
          <Button
            type="button"
            size="sm"
            onClick={handleImageSearch}
            className="h-full px-2 bg-gray-100 hover:bg-gray-200 text-gray-700 border-r border-gray-300"
            title="Search by image"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          className="h-full px-4 bg-flipkart-orange hover:bg-orange-600 text-white rounded-l-none"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
