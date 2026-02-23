const Collected = require("../model/Collected");
const Assignment = require("../model/Assignment");
const PickupRequest = require("../model/PickupRequest");

// ✅ CREATE COLLECTION (existing logic + status update)
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

    // Check if already collected (existing logic)
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

    // Update PickupRequest status → collected
    const assignment = await Assignment.findById(assignmentId);
    if (assignment) {
      await PickupRequest.findByIdAndUpdate(assignment.pickupRequest, {
        status: "collected"
      });
    }

    res.status(201).json({ message: "Collection created successfully." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ GET COLLECTION BY ASSIGNMENT (existing logic unchanged)
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

// ✅ NEW: Delete Collected by its _id
// Resets PickupRequest status → assigned
exports.deleteCollection = async (req, res) => {
  try {
    const { collectedId } = req.params;

    const collected = await Collected.findById(collectedId);
    if (!collected) {
      return res.status(404).json({ message: "Collection not found" });
    }

    // Get assignment to find pickupRequest
    const assignment = await Assignment.findById(collected.assignment);
    if (assignment) {
      // Reset PickupRequest status → assigned
      await PickupRequest.findByIdAndUpdate(assignment.pickupRequest, {
        status: "assigned"
      });
    }

    // Delete the Collected record
    await Collected.findByIdAndDelete(collectedId);

    res.json({ message: "Collection deleted successfully" });

  } catch (error) {
    console.error("deleteCollection error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};