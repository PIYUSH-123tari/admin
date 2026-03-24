const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const managers = require("../model/Manager");

const JWT_SECRET = process.env.JWT_SECRET || "ecoloop_admin_secret_key_2026";
const TOKEN_EXPIRY = "8h";

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

    // Generate JWT token
    const token = jwt.sign(
      { admin_Id: findManager.admin_Id, region_Id: findManager.region_Id },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      admin_Id: findManager.admin_Id,
      region_Id: findManager.region_Id
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { loginManager };
