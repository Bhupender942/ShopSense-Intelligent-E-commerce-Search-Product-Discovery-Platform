import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  ChevronDown,
  Menu,
  X,
  LogOut,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { VoiceSearch } from "@/components/ui/voice-search";
import { EnhancedSearch } from "@/components/ui/enhanced-search"; // ADD THIS LINE

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Get current search query from URL params
  React.useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchQuery(query);
  }, [searchParams]);

  // Close user menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

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

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <header className="bg-flipkart-blue text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-lg md:text-xl font-normal italic text-white hover:text-white/90"
            >
              Flipkart
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <EnhancedSearch
              onSearch={(query, type) => {
                const searchUrl =
                  type === "category"
                    ? `/search?category=${encodeURIComponent(query)}`
                    : `/search?q=${encodeURIComponent(query)}`;
                navigate(searchUrl);
              }}
              placeholder="Search for products, brands and more"
              className="w-full"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Environmental Impact Link */}
            <Link
              to="/environmental-impact"
              className="text-white hover:text-white/90 flex items-center space-x-1"
            >
              <Leaf className="h-4 w-4" />
              <span>Eco Impact</span>
            </Link>

            {/* User Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                className="text-white hover:bg-blue-600 flex items-center space-x-1"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <User className="h-4 w-4" />
                <span>Hi, {user?.name || "User"}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              className="text-white hover:bg-blue-600 flex items-center space-x-1"
            >
              <span>More</span>
              <ChevronDown className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              className="text-white hover:bg-blue-600 flex items-center space-x-1"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Cart</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              className="text-white hover:bg-blue-600 p-2"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-blue-600 p-2"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-blue-600 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <EnhancedSearch
            onSearch={(query, type) => {
              const searchUrl =
                type === "category"
                  ? `/search?category=${encodeURIComponent(query)}`
                  : `/search?q=${encodeURIComponent(query)}`;
              navigate(searchUrl);
            }}
            placeholder="Search for products, brands and more"
            className="w-full"
          />
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-blue-600 pt-4 pb-4">
            <div className="space-y-2">
              {/* User Info */}
              <div className="px-4 py-2 text-white border-b border-blue-600">
                <div className="font-medium">Hi, {user?.name || "User"}</div>
                <div className="text-xs text-white/80">{user?.email}</div>
              </div>

              {/* Environmental Impact Link */}
              <Link
                to="/environmental-impact"
                className="flex items-center w-full px-4 py-2 text-white hover:bg-blue-600"
              >
                <Leaf className="h-4 w-4 mr-2" />
                Eco Impact
              </Link>

              <Button
                variant="ghost"
                className="w-full text-white hover:bg-blue-600 justify-start"
              >
                <span className="mr-2">More</span>
                <ChevronDown className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                className="w-full text-white hover:bg-blue-600 justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
