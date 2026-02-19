const Agent = require("../model/Agent");

// GET ALL AGENTS
exports.getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find();
    res.json(agents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE STATUS + ASSIGNED ORDER
exports.updateAgentStatus = async (req, res) => {
  try {
    const { status, assigned_pending_order } = req.body;

    if (assigned_pending_order < 0) {
      return res.status(400).json({ message: "Orders cannot be negative" });
    }

    const updatedAgent = await Agent.findByIdAndUpdate(
      req.params.id,
      {
        status,
        assigned_pending_order
      },
      { new: true }
    );

    res.json(updatedAgent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
