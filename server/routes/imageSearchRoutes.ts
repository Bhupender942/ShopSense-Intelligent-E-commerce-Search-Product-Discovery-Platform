import express from "express";
import { searchByImage, upload } from "../controllers/imageSearchController";

const router = express.Router();

// POST /api/image-search
// Uploads an image and returns matching products
router.post("/", upload.single("image"), searchByImage);

export default router;
