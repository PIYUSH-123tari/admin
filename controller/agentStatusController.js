const Agent = require("../model/Agent");
const Assignment = require("../model/Assignment");
const Collected = require("../model/Collected");

// GET ALL AGENTS - Dynamically calculate pending orders from DB
exports.getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find();

    const formattedAgents = await Promise.all(agents.map(async (agent) => {

      // Count total assignments for this agent
      const totalAssigned = await Assignment.countDocuments({ agent: agent._id });

      // Count total collected (completed) for this agent
      const totalCollected = await Collected.countDocuments({ agent: agent._id });

      // Pending = assigned - collected (never negative)
      const pendingOrders = Math.max(0, totalAssigned - totalCollected);

      // Auto status based on pending orders
      const calculatedStatus = pendingOrders > 0 ? "unavailable" : "available";

      // Build passport photo URL
      const photoUrl = agent.passport_photo
        ? `http://localhost:3500/${agent.passport_photo.replace(/\\/g, "/")}`
        : null;

      return {
        _id: agent._id,
        agent_name: agent.agent_name,
        assigned_pending_order: pendingOrders,
        status: calculatedStatus,
        passport_photo: photoUrl
      };
    }));

    res.json(formattedAgents);

  } catch (err) {
    console.error("getAllAgents error:", err);
    res.status(500).json({ error: err.message });
  }
};