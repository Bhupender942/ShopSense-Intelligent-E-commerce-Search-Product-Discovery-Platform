import React from "react";
import { Grid3X3, List, Grid, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type LayoutType = "list" | "grid" | "compact" | "detailed";

interface LayoutSelectorProps {
  currentLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
  totalResults: number;
  className?: string;
}

const layoutOptions = [
  {
    type: "list" as LayoutType,
    icon: List,
    label: "List",
    description: "Detailed view with more information",
  },
  {
    type: "grid" as LayoutType,
    icon: Grid3X3,
    label: "Grid",
    description: "Compact grid layout",
  },
  {
    type: "compact" as LayoutType,
    icon: Grid,
    label: "Compact",
    description: "Minimal information",
  },
  {
    type: "detailed" as LayoutType,
    icon: Layout,
    label: "Detailed",
    description: "Full product details",
  },
];

export const LayoutSelector: React.FC<LayoutSelectorProps> = ({
  currentLayout,
  onLayoutChange,
  totalResults,
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">View:</span>
        <div className="flex items-center space-x-1">
          {layoutOptions.map((option) => {
            const IconComponent = option.icon;
            const isActive = currentLayout === option.type;

            return (
              <Button
                key={option.type}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onLayoutChange(option.type)}
                className={`h-8 px-3 ${
                  isActive
                    ? "bg-flipkart-blue text-white"
                    : "text-gray-600 hover:text-flipkart-blue"
                }`}
                title={option.description}
              >
                <IconComponent className="h-4 w-4" />
                <span className="ml-1 text-xs">{option.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Badge variant="secondary" className="text-xs">
          {totalResults.toLocaleString()} results
        </Badge>
      </div>
    </div>
  );
};
