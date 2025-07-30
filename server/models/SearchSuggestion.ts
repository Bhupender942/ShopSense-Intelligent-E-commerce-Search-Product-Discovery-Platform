import mongoose, { Document, Schema } from "mongoose";

export interface ISearchSuggestion extends Document {
  query: string;
  type: "product" | "brand" | "category" | "subcategory";
  category: string;
  searchCount: number;
  clickCount: number;
  ctr: number;
  quality: number;
  isActive: boolean;
  metadata: {
    productCount?: number;
    avgRating?: number;
    avgPrice?: number;
    brands?: string[];
  };
}

const SearchSuggestionSchema = new Schema<ISearchSuggestion>({
  query: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  type: {
    type: String,
    enum: ["product", "brand", "category", "subcategory"],
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "clothing",
      "sports-fitness",
      "beauty-personal-care",
      "home-furniture",
      "electronics",
      "footwear",
      "toys-baby",
      "appliances",
      "books"
    ],
  },
  searchCount: { type: Number, default: 0, min: 0 },
  clickCount: { type: Number, default: 0, min: 0 },
  ctr: { type: Number, default: 0, min: 0, max: 1 },
  quality: { type: Number, default: 0.5, min: 0, max: 1 },
  isActive: { type: Boolean, default: true },
  metadata: {
    productCount: Number,
    avgRating: Number,
    avgPrice: Number,
    brands: [String],
  },
}, { timestamps: true });

// Text index for efficient searching
SearchSuggestionSchema.index({ query: "text" });
SearchSuggestionSchema.index({ type: 1, category: 1 });

const SearchSuggestion = mongoose.models.SearchSuggestion || mongoose.model<ISearchSuggestion>("SearchSuggestion", SearchSuggestionSchema);
export default SearchSuggestion as mongoose.Model<ISearchSuggestion>;