const PickupRequest = require("../model/PickupRequest");
const Manager = require("../model/Manager");
const User = require("../model/User");        // 🔥 ADD THIS
const Category = require("../model/Category"); // 🔥 ADD THIS

exports.getRegionPickupRequests = async (req, res) => {
  try {
    const adminId = req.params.adminId.trim();

    const admin = await Manager.findOne({ admin_Id: adminId });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const pickupRequests = await PickupRequest.find({
  region_Id: admin.region_Id
})
.populate("user", "name email")
.populate("category", "category_name")
.sort({ createdAt: -1 });

    res.status(200).json(pickupRequests);

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};