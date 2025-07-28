import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Search, ShoppingCart, User, ChevronDown, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get current search query from URL params
  React.useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-flipkart-blue text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-lg md:text-xl font-normal italic text-white hover:text-white/90">
              Flipkart
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder="Search for products, brands and more"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2 text-black bg-white border-none rounded-sm focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-0 top-0 h-full px-4 bg-white hover:bg-gray-100 text-flipkart-blue rounded-l-none"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" className="text-white hover:bg-blue-600 flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>Login</span>
            </Button>

            <Button variant="ghost" className="text-white hover:bg-blue-600 flex items-center space-x-1">
              <span>More</span>
              <ChevronDown className="h-4 w-4" />
            </Button>

            <Button variant="ghost" className="text-white hover:bg-blue-600 flex items-center space-x-1">
              <ShoppingCart className="h-4 w-4" />
              <span>Cart</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button variant="ghost" className="text-white hover:bg-blue-600 p-2">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" className="text-white hover:bg-blue-600 p-2">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-blue-600 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search for products, brands and more"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-2 text-black bg-white border-none rounded-sm focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-0 top-0 h-full px-4 bg-white hover:bg-gray-100 text-flipkart-blue rounded-l-none"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-blue-600 pt-4 pb-4">
            <div className="space-y-2">
              <Button variant="ghost" className="w-full text-white hover:bg-blue-600 justify-start">
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
              <Button variant="ghost" className="w-full text-white hover:bg-blue-600 justify-start">
                <span className="mr-2">More</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
