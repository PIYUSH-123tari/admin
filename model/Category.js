// models/Category.js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category_name: String,
  rate_per_kg: Number,
  description: String
});

module.exports = mongoose.model("Category", categorySchema);
