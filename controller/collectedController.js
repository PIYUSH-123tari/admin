const Collected = require("../model/Collected");
const Assignment = require("../model/Assignment");

// CREATE COLLECTION
exports.createCollection = async (req, res) => {
  try {
    const {
      assignmentId,
      agentId,
      categoryId,
      product_description,
      actual_weight,
      received_time
    } = req.body;

    // Check if already collected
    const existing = await Collected.findOne({ assignment: assignmentId });
    if (existing) {
      return res.status(400).json({ message: "Collection already created for this assignment." });
    }

    const newCollection = new Collected({
      assignment: assignmentId,
      agent: agentId,
      category: categoryId,
      product_description,
      actual_weight,
      received_time
    });

    await newCollection.save();

    res.status(201).json({ message: "Collection created successfully." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET COLLECTION BY ASSIGNMENT
exports.getCollectionByAssignment = async (req, res) => {
  try {
    const data = await Collected.findOne({ assignment: req.params.assignmentId })
      .populate("agent")
      .populate("category")
      .populate("assignment");

    if (!data) return res.status(404).json({ message: "No collection found." });

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};