import path from "path";
import fs from "fs";
import db from "../config/db.js";

export const getImages = (req, res) => {
  db.query("SELECT * FROM Images ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
};

db;

export const uploadImage = (req, res) => {
  const { category, subcategory, title, description } = req.body;
  const file = req.file;

  if (!file || !category) {
    return res
      .status(400)
      .json({ error: "No file uploaded or category not provided" });
  }

  const relativePath = file.path
    .replace(path.resolve() + "/", "")
    .replace(/\\/g, "/");
  const imageURL = `${process.env.BASE_URL}/${relativePath}`;

  const query =
    category === "Services"
      ? "INSERT INTO Images (category, subcategory, image_URL, title, description) VALUES (?, ?, ?, ?, ?)"
      : "INSERT INTO Images (category, subcategory, image_URL) VALUES (?, ?, ?)";

  const params =
    category === "Services"
      ? [
          category,
          subcategory || null,
          imageURL,
          title || null,
          description || null,
        ]
      : [category, subcategory || null, imageURL];

  db.query(query, params, (err) => {
    if (err)
      return res.status(500).json({ error: "Database error", details: err });
    res.status(200).json({ message: "Upload successful", image_URL: imageURL });
  });
};

export const deleteImage = (req, res) => {
  const { image_URL } = req.body;
  if (!image_URL) return res.status(400).json({ error: "Missing image_URL" });

  let imagePath = image_URL.replace(`${process.env.BASE_URL}/`, "");
  imagePath = path.resolve(imagePath);

  if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

  db.query("DELETE FROM Images WHERE image_URL = ?", [image_URL], (err) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ message: "Image deleted successfully" });
  });
};
