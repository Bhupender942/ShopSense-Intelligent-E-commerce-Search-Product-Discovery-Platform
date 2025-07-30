import React, { useState, useRef, useEffect } from "react";
import { Search, Clock, TrendingUp, Package, Tag, Star, ShoppingBag } from "lucide-react";
import { useAutosuggest, trackSearchAnalytics } from "@/hooks/use-autosuggest";

interface AutosuggestProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (query: string, type?: string) => void;
  placeholder?: string;
  className?: string;
  category?: string;
}

const typeIcons = {
  product: Package,
  brand: Tag,
  category: ShoppingBag,
  subcategory: Search,
};

const typeLabels = {
  product: "Product",
  brand: "Brand",
  category: "Category",
  subcategory: "Subcategory",
};

// Helper function to highlight matching prefix
const highlightPrefix = (text: string, prefix: string, isTypoCorrection: boolean = false) => {
  if (!prefix.trim()) return text;
  
  const lowerText = text.toLowerCase();
  const lowerPrefix = prefix.toLowerCase();
  
  // For typo corrections, highlight the entire text
  if (isTypoCorrection) {
    return (
      <span className="bg-orange-100 text-orange-800 font-semibold">
        {text}
      </span>
    );
  }
  
  const index = lowerText.indexOf(lowerPrefix);
  
  if (index === -1) {
    // If no exact match, try to find partial matches (for fuzzy matching)
    return (
      <span className="bg-yellow-100 text-yellow-800 font-semibold">
        {text}
      </span>
    );
  }
  
  const beforeMatch = text.slice(0, index);
  const match = text.slice(index, index + prefix.length);
  const afterMatch = text.slice(index + prefix.length);
  
  return (
    <>
      {beforeMatch}
      <span className="bg-blue-100 text-blue-800 font-semibold">
        {match}
      </span>
      {afterMatch}
    </>
  );
};

export const Autosuggest: React.FC<AutosuggestProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = "Search for products, brands and more",
  className = "",
  category,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const { suggestions, hasTypoCorrection, isLoading } = useAutosuggest(value, category);

  useEffect(() => {
    setIsOpen(suggestions.length > 0 || (value.trim().length > 0 && !isLoading));
    setSelectedIndex(-1);
  }, [suggestions, value, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(suggestions[selectedIndex]);
        } else if (value.trim()) {
          handleSelect({ query: value.trim(), type: "product" } as any);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelect = async (suggestion: any) => {
    onChange(suggestion.query);
    onSelect(suggestion.query, suggestion.type);
    setIsOpen(false);
    setSelectedIndex(-1);
    
    // Track analytics
    await trackSearchAnalytics(suggestion.query, "click", suggestion.category);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleFocus = () => {
    if (suggestions.length > 0 || value.trim().length > 0) {
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 150);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="w-full pl-4 pr-12 py-2 text-black bg-white border-none rounded-sm focus:outline-none focus:ring-2 focus:ring-white"
        autoComplete="off"
      />

      {isOpen && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-sm shadow-lg z-50 max-h-96 overflow-y-auto"
        >
          {isLoading && suggestions.length === 0 && (
            <div className="px-4 py-3 text-gray-500 text-sm">
              <Search className="inline h-4 w-4 mr-2 animate-spin" />
              Searching...
            </div>
          )}

          {!isLoading && suggestions.length === 0 && value.trim() && (
            <div className="px-4 py-3 text-gray-500 text-sm">
              No suggestions found for "{value}"
            </div>
          )}

          {suggestions.map((suggestion, index) => {
            const IconComponent = typeIcons[suggestion.type] || Search;
            
            return (
              <div
                key={`${suggestion.query}-${suggestion.type}`}
                className={`px-4 py-3 cursor-pointer flex items-center hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                  index === selectedIndex ? "bg-blue-50" : ""
                }`}
                onClick={() => handleSelect(suggestion)}
              >
                <div className="flex-shrink-0 mr-3">
                  {suggestion.isTypoCorrection ? (
                    <Search className="h-4 w-4 text-orange-500" />
                  ) : (
                    <IconComponent className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <div className="text-sm text-gray-900 truncate">
                      {highlightPrefix(suggestion.query, value, suggestion.isTypoCorrection)}
                    </div>
                    <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      {typeLabels[suggestion.type]}
                    </span>
                  </div>
                  
                  {suggestion.isTypoCorrection && (
                    <div className="text-xs text-orange-600 mt-1">
                      Did you mean this?
                    </div>
                  )}
                  
                  {/* Metadata display */}
                  <div className="flex items-center mt-1 text-xs text-gray-500 space-x-3">
                    {suggestion.metadata?.productCount && (
                      <span>{suggestion.metadata.productCount} products</span>
                    )}
                    {suggestion.metadata?.avgRating && (
                      <div className="flex items-center">
                        <Star className="h-3 w-3 mr-1 text-yellow-400 fill-current" />
                        <span>{suggestion.metadata.avgRating.toFixed(1)}</span>
                      </div>
                    )}
                    {suggestion.metadata?.avgPrice && (
                      <span>{formatPrice(suggestion.metadata.avgPrice)}</span>
                    )}
                  </div>
                </div>

                <div className="text-xs text-gray-400 capitalize ml-2">
                  {suggestion.category.replace("-", " ")}
                </div>
              </div>
            );
          })}

          {hasTypoCorrection && (
            <div className="px-4 py-2 text-xs text-blue-600 bg-blue-50 border-t">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Showing results for similar searches
            </div>
          )}
        </div>
      )}
    </div>
  );
};