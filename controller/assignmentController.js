
const Assignment = require("../model/Assignment");
const PickupRequest = require("../model/PickupRequest");
const Collected = require("../model/Collected");
const Agent = require("../model/Agent");

// ✅ Create Assignment (existing logic unchanged)
exports.createAssignment = async (req, res) => {
  try {
    const { pickupRequestId, agentId, assigned_date, assigned_time } = req.body;

    const newAssignment = await Assignment.create({
      pickupRequest: pickupRequestId,
      agent: agentId,
      assigned_date,
      assigned_time
    });

    // Update pickup request status → assigned
    await PickupRequest.findByIdAndUpdate(pickupRequestId, { status: "assigned" });

    res.status(201).json({
      message: "Assignment created successfully",
      assignment: newAssignment
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get assignment by pickupRequestId (existing logic unchanged)
exports.getAssignmentByPickup = async (req, res) => {
  try {
    const assignment = await Assignment.findOne({
      pickupRequest: req.params.pickupId
    }).populate("agent");

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ NEW: Delete Assignment by Assignment _id
// Cascades: deletes related Collected, resets PickupRequest status → pending
exports.deleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // 1. Delete related Collected record (if exists)
    await Collected.deleteOne({ assignment: assignmentId });

    // 2. Reset PickupRequest status → pending
    await PickupRequest.findByIdAndUpdate(assignment.pickupRequest, {
      status: "pending"
    });

    // 3. Delete the Assignment itself
    await Assignment.findByIdAndDelete(assignmentId);

    res.json({ message: "Assignment deleted successfully" });

  } catch (error) {
    console.error("deleteAssignment error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ NEW: Delete Assignment by PickupRequest _id
// Called from Ecoloop when user deletes/updates their pickup request
exports.deleteAssignmentByPickup = async (req, res) => {
  try {
    const { pickupId } = req.params;

    const assignment = await Assignment.findOne({ pickupRequest: pickupId });
    if (!assignment) {
      return res.status(200).json({ message: "No assignment found for this pickup" });
    }

    // 1. Delete related Collected
    await Collected.deleteOne({ assignment: assignment._id });

    // 2. Delete the Assignment
    await Assignment.findByIdAndDelete(assignment._id);

    // Note: PickupRequest status is handled by Ecoloop delete controller
    res.json({ message: "Assignment and collected deleted successfully" });

  } catch (error) {
    console.error("deleteAssignmentByPickup error:", error);
    res.status(500).json({ message: error.message });
  }
};