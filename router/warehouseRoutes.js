const express = require("express");
const router = express.Router();
const Warehouse = require("../model/Warehouse");
require("../model/Region");
require("../model/Manager");
const auth = require("../middleware/authMiddleware");

router.use(auth); // Protect warehouse routes

// GET all warehouses
router.get("/", async (req, res) => {
  try {
    const warehouses = await Warehouse.find().populate('region_id').populate('manager_id');
    res.json(warehouses);
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
