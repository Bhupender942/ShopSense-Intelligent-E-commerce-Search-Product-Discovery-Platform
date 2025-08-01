import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnalysisResult {
  query: string;
  analysis: {
    filters: Record<string, string>;
    confidence: number;
    entities: string[];
    inferredIntent?: string;
  };
  matchingFilters: Record<string, any>;
  sampleProducts: any[];
}

const QueryAnalyzer = () => {
  const [query, setQuery] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeQuery = async () => {
    if (!query.trim()) {
      setError("Please enter a search query");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/autosuggest/analyze-query?q=${encodeURIComponent(query)}`,
      );

      if (!response.ok) {
        throw new Error("Failed to analyze query");
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Query Understanding Analyzer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Enter a search query (e.g., 'sneakers for men')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analyzeQuery()}
            className="flex-1"
          />
          <Button onClick={analyzeQuery} disabled={isLoading}>
            {isLoading ? "Analyzing..." : "Analyze"}
          </Button>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {analysisResult && (
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="text-lg font-medium">Query Understanding</h3>
              <p className="text-sm text-gray-500">
                Confidence:{" "}
                {(analysisResult.analysis.confidence * 100).toFixed(1)}%
              </p>

              <div className="mt-2">
                <h4 className="text-sm font-medium">Detected Entities:</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {analysisResult.analysis.entities.map((entity, i) => (
                    <Badge key={i} variant="outline">
                      {entity}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <h4 className="text-sm font-medium">Inferred Filters:</h4>
                <ul className="mt-1 space-y-1">
                  {Object.entries(analysisResult.analysis.filters).map(
                    ([key, value]) => (
                      <li key={key} className="text-sm">
                        <span className="font-medium">{key}:</span> {value}
                      </li>
                    ),
                  )}
                </ul>
              </div>

              {analysisResult.analysis.inferredIntent && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium">Inferred Intent:</h4>
                  <p className="text-sm">
                    {analysisResult.analysis.inferredIntent}
                  </p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium">Sample Matching Products</h3>
              {analysisResult.sampleProducts.length > 0 ? (
                <div className="mt-2 divide-y">
                  {analysisResult.sampleProducts.map((product) => (
                    <div key={product.product_id} className="py-2">
                      <p className="font-medium">{product.title}</p>
                      <div className="text-sm text-gray-500">
                        {product.brand} · {product.category} ·{" "}
                        {product.subcategory}
                        {product.gender && ` · ${product.gender}`}
                      </div>
                      <p className="text-sm mt-1">₹{product.price}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-2">
                  No matching products found
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QueryAnalyzer;
