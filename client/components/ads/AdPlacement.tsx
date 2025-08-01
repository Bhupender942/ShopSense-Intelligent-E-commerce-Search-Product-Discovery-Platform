import React from "react";
import { AdBanner, AdBanner as AdBannerType } from "./AdBanner";

interface AdPlacementProps {
  products: any[];
  ads: AdBannerType[];
  adFrequency: number; // Show ad every N products
  className?: string;
}

export const AdPlacement: React.FC<AdPlacementProps> = ({
  products,
  ads,
  adFrequency = 8,
  className = "",
}) => {
  const renderAd = (ad: AdBannerType, index: number) => {
    // Determine ad variant based on position
    const variant = index % 2 === 0 ? "horizontal" : "vertical";

    return (
      <div key={`ad-${ad.id}-${index}`} className="mb-4">
        <AdBanner banner={ad} variant={variant} />
      </div>
    );
  };

  const renderProductsWithAds = () => {
    const elements: React.ReactNode[] = [];
    let adIndex = 0;

    products.forEach((product, productIndex) => {
      // Add product
      elements.push(
        <div key={`product-${product.id || productIndex}`} className="mb-4">
          {/* Product component will be passed as children */}
          {product}
        </div>,
      );

      // Add ad if it's time for one
      if ((productIndex + 1) % adFrequency === 0 && ads[adIndex]) {
        elements.push(renderAd(ads[adIndex], adIndex));
        adIndex = (adIndex + 1) % ads.length; // Cycle through ads
      }
    });

    return elements;
  };

  return <div className={className}>{renderProductsWithAds()}</div>;
};

// Specialized ad placement components for different scenarios
export const TopBanner: React.FC<{ ads: AdBannerType[] }> = ({ ads }) => {
  const topAd = ads.find((ad) => ad.type === "banner" && ad.priority === 1);

  if (!topAd) return null;

  return (
    <div className="mb-6">
      <AdBanner banner={topAd} variant="horizontal" />
    </div>
  );
};

export const SidebarAds: React.FC<{ ads: AdBannerType[] }> = ({ ads }) => {
  const sidebarAds = ads.filter(
    (ad) => ad.type === "promo" || ad.type === "featured",
  );

  return (
    <div className="space-y-4">
      {sidebarAds.slice(0, 3).map((ad) => (
        <AdBanner key={ad.id} banner={ad} variant="vertical" />
      ))}
    </div>
  );
};

export const SponsoredSection: React.FC<{ ads: AdBannerType[] }> = ({
  ads,
}) => {
  const sponsoredAds = ads.filter((ad) => ad.type === "sponsored");

  if (sponsoredAds.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          Sponsored Products
        </h3>
        <p className="text-sm text-yellow-700">
          These products are sponsored by our partners
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sponsoredAds.slice(0, 6).map((ad) => (
          <AdBanner key={ad.id} banner={ad} variant="compact" />
        ))}
      </div>
    </div>
  );
};
