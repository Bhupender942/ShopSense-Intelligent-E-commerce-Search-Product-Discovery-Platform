import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Product from "../models/Products";

// Create __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define interface to extend Express Request type to include file property added by multer
interface MulterRequest extends Request {
  file?: {
    path: string;
    filename: string;
    originalname: string;
    mimetype: string;
    size: number;
    destination: string;
    buffer?: Buffer;
    encoding?: string;
    fieldname?: string;
  };
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const fileExt = path.extname(file.originalname);
    cb(null, `${uniqueId}${fileExt}`);
  },
});

// Filter files to only accept images
const fileFilter = (req: Request, file: any, cb: multer.FileFilterCallback) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

/**
 * Process image search
 * This is a simplified version that matches images based on colors and features
 * A production version would use more sophisticated ML models for visual similarity
 */
export const searchByImage = async (
  req: MulterRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No image file uploaded" });
      return;
    }

    const { category } = req.body;

    // In a real implementation, we would:
    // 1. Extract features from the uploaded image
    // 2. Compare against pre-computed features of product images
    // 3. Return the most similar products

    // For this demo, we'll simulate image search by returning products from the category
    // or popular products if no category is specified
    const query: any = {};
    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    // Get products sorted by popularity with better variety
    const products = await Product.find(query)
      .sort({ popularity_score: -1, average_rating: -1 })
      .limit(24)
      .select(
        "product_id title brand category subcategory price original_price discount_percentage average_rating rating_count availability images popularity_score",
      )
      .lean();

    // Transform products to match frontend expectations
    const transformedProducts = products.map((product) => ({
      id: product.product_id,
      _id: product._id,
      product_id: product.product_id,
      title: product.title,
      brand: product.brand,
      category: product.category,
      subcategory: product.subcategory,
      price: product.price,
      original_price: product.original_price,
      discount_percentage: product.discount_percentage,
      average_rating: product.average_rating,
      rating_count: product.rating_count,
      availability: product.availability,
      images: product.images,
      popularity_score: product.popularity_score,
      // Add some mock data for better display
      specifications: [
        `${product.brand} ${product.category}`,
        `Popular in ${product.category}`,
        "High quality product",
      ],
      offers: ["Bank Offer", "Exchange Offer", "No Cost EMI"],
      assured: Math.random() > 0.5,
    }));

    // Return the file path for demonstration purposes
    const filePath = req.file.path.replace(/\\/g, "/");
    const fileName = path.basename(filePath);

    res.status(200).json({
      products: transformedProducts,
      uploadedImage: `/uploads/${fileName}`,
      message: "Image search results",
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalProducts: transformedProducts.length,
        hasNext: false,
        hasPrev: false,
      },
    });

    // In a production system, you would want to clean up the uploaded file
    // or move it to permanent storage if needed
  } catch (error) {
    console.error("Error in image search:", error);
    res.status(500).json({ message: "Error processing image search" });
  }
};
