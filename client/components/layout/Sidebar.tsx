import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-flipkart-border pb-4 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
      >
        <span>{title}</span>
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      {isOpen && <div className="space-y-2">{children}</div>}
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const [priceRange, setPriceRange] = useState([0, 50000]);

  return (
    <aside className="w-64 bg-white px-4 pt-4 pb-[200px] border-r border-flipkart-border mb-[200px]">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      {/* Categories */}
      <FilterSection title="CATEGORIES">
        <div className="space-y-2">
          <div htmlFor="mobiles" className="text-sm text-flipkart-text-gray pl-2">
            Mobiles & Accessories
          </div>
          <div className="flex">
            <label htmlFor="mobiles-only" className="text-sm text-flipkart-text-gray font-medium ml-2">
              Mobiles
            </label>
            <div className="ml-4 space-y-2">
              <div className="flex items-center">
              </div>
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="PRICE">
        <div className="space-y-4">
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={50000}
              min={0}
              step={1000}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-flipkart-text-gray">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}+</span>
          </div>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-sm p-0 h-auto font-normal">
              ₹5,000 - ₹10,000
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm p-0 h-auto font-normal">
              ₹10,000 - ₹15,000
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm p-0 h-auto font-normal">
              ₹15,000 - ₹25,000
            </Button>
          </div>
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="BRAND">
        <div className="space-y-2">
          {['POCO', 'Xiaomi', 'Samsung', 'OPPO', 'Vivo', 'OnePlus'].map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox id={brand.toLowerCase()} />
              <label htmlFor={brand.toLowerCase()} className="text-sm text-flipkart-text-gray">
                {brand}
              </label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Customer Ratings */}
      <FilterSection title="CUSTOMER RATINGS">
        <div className="space-y-2">
          {['4★ & above', '3★ & above', '2★ & above', '1★ & above'].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox id={rating} />
              <label htmlFor={rating} className="text-sm text-flipkart-text-gray">
                {rating}
              </label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* GST Invoice Available */}
      <FilterSection title="GST INVOICE AVAILABLE">
        <div className="flex items-center space-x-2">
          <Checkbox id="gst" />
          <label htmlFor="gst" className="text-sm text-flipkart-text-gray">
            GST Invoice Available
          </label>
        </div>
      </FilterSection>
    </aside>
  );
};
