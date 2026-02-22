const Assignment = require("../model/Assignment");
const PickupRequest = require("../model/PickupRequest");
const Agent = require("../model/Agent");

// ✅ Create Assignment
exports.createAssignment = async (req, res) => {
  try {
    const { pickupRequestId, agentId, assigned_date, assigned_time } = req.body;

    // Create assignment
    const newAssignment = await Assignment.create({
      pickupRequest: pickupRequestId,
      agent: agentId,
      assigned_date,
      assigned_time
    });

    // Update pickup request status
    await PickupRequest.findByIdAndUpdate(pickupRequestId, {
      status: "assigned"
    });

    res.status(201).json({
      message: "Assignment created successfully",
      assignment: newAssignment
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get assignment by pickupRequestId
exports.getAssignmentByPickup = async (req, res) => {
  try {
    const pickupId = req.params.pickupId;

    const assignment = await Assignment.findOne({
      pickupRequest: pickupId
    }).populate("agent");

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json(assignment);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};