const Agent = require("../model/Agent");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

exports.createAgent = async (req, res) => {
  try {
    const {
      agent_name,
      agent_address,
      agent_phoneNo,
      agent_email,
      password,
      status,
      region_Id
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
      status,
      region_Id,
      assigned_pending_order: 0
    });

    await newAgent.save();

    res.status(201).json({
      message: "Agent created successfully",
      agent: newAgent
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
