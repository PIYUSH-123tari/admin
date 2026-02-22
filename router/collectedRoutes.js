const express = require("express");
const router = express.Router();
const collectedController = require("../controller/collectedController");


const Collected = require("../model/Collected");

// GET all collections
router.get("/", async (req, res) => {
  try {
    const collections = await Collected.find()
      .populate("assignment")   // to get assignment object
      .populate("category")     // to get category_name
      .sort({ createdAt: -1 });

    res.json(collections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/create", collectedController.createCollection);
router.get("/assignment/:assignmentId", collectedController.getCollectionByAssignment);

module.exports = router;