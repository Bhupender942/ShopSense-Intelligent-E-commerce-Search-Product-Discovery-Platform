import React from "react";
import QueryAnalyzer from "../components/QueryAnalyzer";

const QueryUnderstanding = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Query Understanding Demo
      </h1>

      <div className="max-w-4xl mx-auto mb-8">
        <h2 className="text-xl font-semibold mb-2">How it works</h2>
        <p className="mb-4">
          This demo showcases the natural language understanding capability that
          extracts structured filters from search queries. Enter search queries
          like "sneakers for men" or "rakhi for bhai" and see how the system
          interprets them.
        </p>

        <h3 className="text-lg font-medium mt-6 mb-2">
          Example queries to try:
        </h3>
        <ul className="list-disc list-inside space-y-1 mb-6">
          <li>sneakers for men</li>
          <li>women's boots</li>
          <li>kids shoes</li>
          <li>rakhi for bhai</li>
          <li>diwali lights</li>
        </ul>
      </div>

      <QueryAnalyzer />

      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-xl font-semibold mb-4">Technical Implementation</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Knowledge Graph</h3>
            <p>
              A structured representation of product entities, their types,
              attributes and relationships. This powers the semantic
              understanding of queries beyond simple keyword matching.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Query Processing Pipeline</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Tokenization of the search query</li>
              <li>Entity extraction and classification</li>
              <li>Relationship resolution between entities</li>
              <li>Filter generation based on entity attributes</li>
              <li>Confidence scoring of the results</li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-medium">Integration with Search</h3>
            <p>
              This functionality is integrated with the main search API,
              automatically converting natural language queries to structured
              filters for more relevant results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryUnderstanding;
