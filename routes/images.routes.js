import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";

import {
  getImages,
  uploadImage,
  deleteImage,
} from "../controllers/images.controller.js";

const router = express.Router();

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { category, subcategory } = req.body;
    let uploadPath = path.join("assets/uploads", category);
    if (["Brand_Activations", "Branding"].includes(category) && subcategory) {
      uploadPath = path.join(uploadPath, subcategory);
    }
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

// Routes
router.get("/", getImages);
router.post("/", upload.single("image"), uploadImage);
router.delete("/", deleteImage);

export default router;
