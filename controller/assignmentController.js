const Assignment = require("../model/Assignment");
const PickupRequest = require("../model/PickupRequest");
const Collected = require("../model/Collected");
const Agent = require("../model/Agent");

// ✅ Create Assignment
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

    // ✅ INCREMENT agent's assigned_pending_order by 1
    await Agent.findByIdAndUpdate(agentId, {
      $inc: { assigned_pending_order: 1 }
    });

    res.status(201).json({
      message: "Assignment created successfully",
      assignment: newAssignment
    });

  } catch (error) {
    console.error("createAssignment error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get assignment by pickupRequestId (unchanged)
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

// ✅ Delete Assignment by Assignment _id
exports.deleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Check if collected exists for this assignment
    const collectedExists = await Collected.findOne({ assignment: assignmentId });

    // 1. Delete related Collected record (if exists)
    await Collected.deleteOne({ assignment: assignmentId });

    // 2. Reset PickupRequest status → pending
    await PickupRequest.findByIdAndUpdate(assignment.pickupRequest, {
      status: "pending"
    });

    // 3. Delete the Assignment itself
    await Assignment.findByIdAndDelete(assignmentId);

    // ✅ DECREMENT only if collected did NOT exist
    // (if collected existed, it was already decremented when collected was created)
    if (!collectedExists) {
      await Agent.findByIdAndUpdate(assignment.agent, {
        $inc: { assigned_pending_order: -1 }
      });
    }

    res.json({ message: "Assignment deleted successfully" });

  } catch (error) {
    console.error("deleteAssignment error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Assignment by PickupRequest _id
exports.deleteAssignmentByPickup = async (req, res) => {
  try {
    const { pickupId } = req.params;

    const assignment = await Assignment.findOne({ pickupRequest: pickupId });
    if (!assignment) {
      return res.status(200).json({ message: "No assignment found for this pickup" });
    }

    // Check if collected exists
    const collectedExists = await Collected.findOne({ assignment: assignment._id });

    // 1. Delete related Collected
    await Collected.deleteOne({ assignment: assignment._id });

    // 2. Delete the Assignment
    await Assignment.findByIdAndDelete(assignment._id);

    // ✅ DECREMENT only if collected did NOT exist
    if (!collectedExists) {
      await Agent.findByIdAndUpdate(assignment.agent, {
        $inc: { assigned_pending_order: -1 }
      });
    }

    res.json({ message: "Assignment and collected deleted successfully" });

  } catch (error) {
    console.error("deleteAssignmentByPickup error:", error);
    res.status(500).json({ message: error.message });
  }
};