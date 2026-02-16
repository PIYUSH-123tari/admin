const bcrypt = require("bcrypt");
const managers = require("../model/Manager");

const loginManager = async (req, res) => {
  try {
    const { email, password, admin_Id } = req.body;

    if (!email || !password || !admin_Id) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const findManager = await managers.findOne({
      email,
      admin_Id
    });

    if (!findManager) {
      return res.status(401).json({ message: "Invalid email or admin ID" });
    }

    const isMatch = await bcrypt.compare(password, findManager.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    return res.status(200).json({
      message: "Login successful",
      admin_Id: findManager.admin_Id,
      region_Id: findManager.region_Id
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { loginManager };
