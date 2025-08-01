import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QueryUnderstandingProps {
  queryUnderstanding?: {
    inferredFilters: Record<string, any>;
    inferredIntent?: string;
    usingDerivedFilters: boolean;
  };
  query: string;
}

export function QueryUnderstandingPanel({
  queryUnderstanding,
  query,
}: QueryUnderstandingProps) {
  if (!queryUnderstanding || !queryUnderstanding.usingDerivedFilters) {
    return null; // Don't show panel if no query understanding is available
  }

  const { inferredFilters, inferredIntent } = queryUnderstanding;

  // Format filter for display
  const formatFilter = (key: string, value: any): string => {
    if (key === "gender") {
      if (value === "male") return "Men";
      if (value === "female") return "Women";
      return value.charAt(0).toUpperCase() + value.slice(1);
    }

    if (typeof value === "string") {
      // Make category/subcategory names title case
      return value
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    return String(value);
  };

  // Get badge color variant based on filter type
  const getBadgeVariant = (
    key: string,
  ): "default" | "secondary" | "outline" => {
    switch (key) {
      case "category":
        return "default";
      case "subcategory":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className="mb-4 bg-muted/30">
      <CardHeader className="py-2">
        <CardTitle className="text-sm font-medium flex justify-between items-center">
          <span>Smart Search Results for "{query}"</span>
          {inferredIntent && (
            <span className="text-xs text-muted-foreground">
              Intent: {inferredIntent.replace(/_/g, " ")}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <div className="flex flex-wrap gap-2">
          {Object.entries(inferredFilters).map(([key, value]) => (
            <Badge key={key} variant={getBadgeVariant(key)}>
              <span className="opacity-70 mr-1">{key}:</span>{" "}
              {formatFilter(key, value)}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
