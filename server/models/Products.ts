import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  product_id: string;
  title: string;
  brand: string;
  category: string;
  subcategory: string;
  gender: string;
  price: number;
  original_price: number;
  discount_percentage: number;
  average_rating: number;
  rating_count: number;
  availability: string;
  stock_count: number;
  is_sponsored: boolean;
  description: string;
  specifications: object;
  images: string[];
  tags: string[];
  seller: object;
  popularity_score: number;
  date_added: string;
  // Environmental metrics
  environmentalMetrics?: {
    co2Emissions: number;
    waterFootprint: number;
    energyConsumption: number;
    recyclabilityScore: number;
    ecoFriendlyScore: number;
    isEcoFriendly: boolean;
    environmentalBadge: string;
    sustainabilityFeatures: string[];
  };
}

const ProductSchema = new Schema<IProduct>({
  product_id: { type: String, required: true, unique: true },
  title: { type: String, required: true, index: true },
  brand: { type: String, required: true, index: true },
  category: { type: String, required: true, index: true },
  subcategory: { type: String, required: true, index: true },
  gender: String,
  price: Number,
  original_price: Number,
  discount_percentage: Number,
  average_rating: Number,
  rating_count: Number,
  availability: String,
  stock_count: Number,
  is_sponsored: Boolean,
  description: String,
  specifications: Schema.Types.Mixed,
  images: [String],
  tags: [String],
  seller: Schema.Types.Mixed,
  popularity_score: { type: Number, index: true },
  date_added: String,
  // Environmental metrics schema
  environmentalMetrics: {
    co2Emissions: { type: Number, default: 0 },
    waterFootprint: { type: Number, default: 0 },
    energyConsumption: { type: Number, default: 0 },
    recyclabilityScore: { type: Number, default: 0 },
    ecoFriendlyScore: { type: Number, default: 0 },
    isEcoFriendly: { type: Boolean, default: false },
    environmentalBadge: { type: String, default: "" },
    sustainabilityFeatures: [String],
  },
});

// Text index for search functionality
ProductSchema.index({
  title: "text",
  brand: "text",
  category: "text",
  subcategory: "text",
  tags: "text",
});

// Index for environmental metrics
ProductSchema.index({ "environmentalMetrics.isEcoFriendly": 1 });
ProductSchema.index({ "environmentalMetrics.ecoFriendlyScore": -1 });

const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
export default Product as mongoose.Model<IProduct>;
