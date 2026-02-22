const Agent = require("../model/Agent");

// GET ALL AGENTS (Auto Calculate Status)
exports.getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find();

    const formattedAgents = agents.map(agent => {

      // Prevent negative values
      const orders = agent.assigned_pending_order < 0 
        ? 0 
        : agent.assigned_pending_order;

      // AUTO STATUS LOGIC
      const calculatedStatus = orders > 0 
        ? "unavailable" 
        : "available";

      return {
        _id: agent._id, // Mongo ObjectId
        agent_name: agent.agent_name,
        assigned_pending_order: orders,
        status: calculatedStatus
      };
    });

    res.json(formattedAgents);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};