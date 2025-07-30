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
});

// Text index for search functionality
ProductSchema.index({
  title: "text",
  brand: "text",
  category: "text",
  subcategory: "text",
  tags: "text"
});

const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
export default Product as mongoose.Model<IProduct>;