const express = require("express");
const router = express.Router();
const Category = require("../model/Category");
const auth = require("../middleware/authMiddleware");

router.use(auth); // Protect category routes

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ category_name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;