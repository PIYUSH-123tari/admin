const Agent = require("../model/Agent");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const createAgent = async (req, res) => {
  try {

    const {
      agent_name,
      agent_address,
      agent_phoneNo,
      agent_email,
      password,
      region
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10); 
    const newAgent = new Agent({
      agent_Id: uuidv4(),
      agent_name,
      agent_address,
      agent_phoneNo,
      agent_email,
      password: hashedPassword,
      passport_photo: req.files["passport_photo"][0].path,
      adhar_photo: req.files["adhar_photo"][0].path,
      region,   // ✅ ObjectId reference
      assigned_pending_order: 0
    });

    await newAgent.save();

    res.status(201).json({
      message: "Agent created successfully",
      agent: newAgent
    });

  } catch (err) {

  console.error(err);

  if (err.code === 11000) {

    if (err.keyPattern.agent_phoneNo) {
      return res.status(400).json({
        message: "Phone number already exists"
      });
    }

    if (err.keyPattern.agent_email) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }
  }

  res.status(500).json({ message: "Server error" });
}
};
const mongoose = require("mongoose");

const getAllAgents = async (req, res) => {
  try {

    const regionId = req.query.region;

    if (!regionId) {
      return res.status(400).json({ message: "Region ID required" });
    }

    if (!mongoose.Types.ObjectId.isValid(regionId)) {
      return res.status(400).json({ message: "Invalid Region ID" });
    }

    const agents = await Agent.find({ region: regionId })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(agents);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateAgent = async (req, res) => {
  try {

    const agentId = req.params.id;

    const agent = await Agent.findById(agentId);

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    const {
      agent_name,
      agent_address,
      agent_phoneNo,
      agent_email,
      password
    } = req.body;

    agent.agent_name = agent_name;
    agent.agent_address = agent_address;
    agent.agent_phoneNo = agent_phoneNo;
    agent.agent_email = agent_email;

    if (password && password.trim() !== "") {
      agent.password = await bcrypt.hash(password, 10);
    }

    if (req.files["passport_photo"]) {
      agent.passport_photo = req.files["passport_photo"][0].path;
    }

    if (req.files["adhar_photo"]) {
      agent.adhar_photo = req.files["adhar_photo"][0].path;
    }

    await agent.save();

    res.json({ message: "Agent updated successfully" });

  } catch (err) {

  console.error(err);

  if (err.code === 11000) {

    if (err.keyPattern.agent_phoneNo) {
      return res.status(400).json({
        message: "Phone number already exists"
      });
    }

    if (err.keyPattern.agent_email) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }
  }

  res.status(500).json({ message: "Server error" });
}
};


module.exports = { createAgent, getAllAgents, updateAgent };

