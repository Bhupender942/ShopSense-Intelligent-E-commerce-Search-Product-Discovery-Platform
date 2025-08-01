import React from "react";
import { ExternalLink, Star, Tag, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface AdBanner {
  id: string;
  type: "banner" | "promo" | "sponsored" | "featured";
  title: string;
  description?: string;
  image: string;
  link: string;
  ctaText: string;
  discount?: number;
  validUntil?: string;
  category?: string;
  priority: number;
  isActive: boolean;
}

interface AdBannerProps {
  banner: AdBanner;
  className?: string;
  variant?: "horizontal" | "vertical" | "compact";
}

export const AdBanner: React.FC<AdBannerProps> = ({
  banner,
  className = "",
  variant = "horizontal",
}) => {
  const isExpired =
    banner.validUntil && new Date(banner.validUntil) < new Date();

  if (!banner.isActive || isExpired) {
    return null;
  }

  const getVariantClasses = () => {
    switch (variant) {
      case "vertical":
        return "flex-col h-80 w-64";
      case "compact":
        return "flex-row h-24 w-full";
      default:
        return "flex-row h-32 w-full";
    }
  };

  const getImageClasses = () => {
    switch (variant) {
      case "vertical":
        return "w-full h-48 object-cover";
      case "compact":
        return "w-24 h-24 object-cover";
      default:
        return "w-32 h-32 object-cover";
    }
  };

  return (
    <div
      className={`bg-white border border-flipkart-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${getVariantClasses()} ${className}`}
    >
      {/* Banner Image */}
      <div className="relative flex-shrink-0">
        <img
          src={banner.image}
          alt={banner.title}
          className={`${getImageClasses()} rounded-t-lg`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />

        {/* Banner Type Badge */}
        <div className="absolute top-2 left-2">
          <Badge
            variant={
              banner.type === "sponsored"
                ? "destructive"
                : banner.type === "featured"
                  ? "default"
                  : "secondary"
            }
            className="text-xs"
          >
            {banner.type === "sponsored" && <Star className="h-3 w-3 mr-1" />}
            {banner.type === "promo" && <Tag className="h-3 w-3 mr-1" />}
            {banner.type}
          </Badge>
        </div>

        {/* Discount Badge */}
        {banner.discount && (
          <div className="absolute top-2 right-2">
            <Badge variant="destructive" className="text-xs">
              {banner.discount}% OFF
            </Badge>
          </div>
        )}
      </div>

      {/* Banner Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h3 className="font-medium text-gray-900 mb-1">{banner.title}</h3>
          {banner.description && (
            <p className="text-sm text-gray-600 mb-2">{banner.description}</p>
          )}

          {/* Category */}
          {banner.category && (
            <div className="text-xs text-gray-500 mb-2">
              Category: {banner.category}
            </div>
          )}

          {/* Valid Until */}
          {banner.validUntil && (
            <div className="flex items-center text-xs text-gray-500 mb-2">
              <Clock className="h-3 w-3 mr-1" />
              Valid until {new Date(banner.validUntil).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className="flex items-center justify-between">
          <Button
            size="sm"
            className="bg-flipkart-orange hover:bg-orange-600 text-white"
            onClick={() => window.open(banner.link, "_blank")}
          >
            {banner.ctaText}
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
