import React from "react";
import { Badge } from "./badge";
import { Leaf, Recycle, AlertTriangle, Globe } from "lucide-react";

export interface EnvironmentalMetrics {
  co2Emissions: number;
  waterFootprint: number;
  energyConsumption: number;
  recyclabilityScore: number;
  ecoFriendlyScore: number;
  isEcoFriendly: boolean;
  environmentalBadge: string;
  sustainabilityFeatures: string[];
}

interface EnvironmentalBadgeProps {
  metrics: EnvironmentalMetrics;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
  className?: string;
}

export const EnvironmentalBadge: React.FC<EnvironmentalBadgeProps> = ({
  metrics,
  size = "md",
  showDetails = false,
  className = "",
}) => {
  const getBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    if (score >= 40) return "outline";
    return "destructive";
  };

  const getBadgeIcon = (badge: string) => {
    if (badge.includes("Champion") || badge.includes("Green"))
      return <Leaf className="h-3 w-3" />;
    if (badge.includes("Eco Friendly") || badge.includes("Recyclable"))
      return <Recycle className="h-3 w-3" />;
    if (badge.includes("High Impact"))
      return <AlertTriangle className="h-3 w-3" />;
    return <Globe className="h-3 w-3" />;
  };

  const getBadgeColor = (badge: string) => {
    if (badge.includes("Champion"))
      return "bg-green-100 text-green-800 border-green-200";
    if (badge.includes("Green"))
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (badge.includes("Eco Friendly"))
      return "bg-blue-100 text-blue-800 border-blue-200";
    if (badge.includes("Moderate"))
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Badge
          variant={getBadgeVariant(metrics.ecoFriendlyScore)}
          className={`${getBadgeColor(metrics.environmentalBadge)} ${sizeClasses[size]} flex items-center gap-1`}
        >
          {getBadgeIcon(metrics.environmentalBadge)}
          {metrics.environmentalBadge}
        </Badge>

        {metrics.isEcoFriendly && (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Eco-Friendly
          </Badge>
        )}
      </div>

      {showDetails && (
        <div className="space-y-2 text-xs text-gray-600">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-medium">CO₂ Emissions</div>
              <div className="text-sm">{metrics.co2Emissions} kg CO₂e</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-medium">Water Footprint</div>
              <div className="text-sm">
                {metrics.waterFootprint.toLocaleString()} L
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-medium">Energy</div>
              <div className="text-sm">{metrics.energyConsumption} kWh</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-medium">Recyclability</div>
              <div className="text-sm">{metrics.recyclabilityScore}%</div>
            </div>
          </div>

          {metrics.sustainabilityFeatures.length > 0 && (
            <div className="bg-green-50 p-2 rounded">
              <div className="font-medium text-green-800 mb-1">
                Sustainability Features:
              </div>
              <ul className="text-xs text-green-700 space-y-0.5">
                {metrics.sustainabilityFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-1">
                    <Leaf className="h-2 w-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
