import React, { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "./button";
import { Autosuggest } from "./autosuggest";
import { VoiceSearch } from "./voice-search";
import { trackSearchAnalytics } from "@/hooks/use-autosuggest";

interface EnhancedSearchProps {
  onSearch: (query: string, type?: string) => void;
  placeholder?: string;
  className?: string;
  category?: string;
  showVoiceSearch?: boolean;
}

export const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  onSearch,
  placeholder = "Search for products, brands and more",
  className = "",
  category,
  showVoiceSearch = true,
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
